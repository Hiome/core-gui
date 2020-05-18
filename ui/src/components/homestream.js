import { connect } from 'mqtt/dist/mqtt'

const API_URL = process.env.API_URL
const mqttClient = () => connect(`ws://${window.location.host}:1884`)

/* everything (EXCEPT EXPORT) below is identical to nodejs version */

const readStream = (topic, start, opts, cb) => {
  let url = `${API_URL}api/1/${topic.replace('#', '~~').replace('+','~')}/${start}`
  if (typeof opts === "function") {
    cb = opts
  } else if (opts) {
    const q = new URLSearchParams(opts).toString()
    if (q.length > 0) {
      url += '?' + q
    }
  }
  return fetch(url).then(resp => resp.json()).then(resp => resp.forEach(m => {
    m.data = JSON.parse(m.payload)
    m.val = m.data['val']
  })).then(cb)
}

const mqttPub = (t, m, o) => {
  const client = mqttClient()
  client.on('connect', () => client.publish(t, m, o, () => client.end()))
}

const HomeStream = {
  read: readStream,
  readRetained: (topic, cb) => readStream(topic, 'retained', cb),
  erase: topic => mqttPub(`hs/1/${topic}`, '', {retain: true}),
  write: (topic, val, opts) => {
    if (typeof opts === "boolean") opts = {retain: opts}
    const payload = typeof val === 'object' ? val : {'val': val}
    payload['ts'] = Date.now()
    mqttPub(`hs/1/${topic}`, JSON.stringify(payload), opts)
    return payload['ts']
  },
  subscribe: (topics, cb, cb_deleted) => {
    const msg_cache = {}
    const client = mqttClient()
    client.on('connect', () => {
      if (typeof topics === "string") topics = Array(topics)
      topics.forEach(t => client.subscribe(t, {qos: 1}))
    })
    client.on('message', function(t, m, p) {
      t = t.toLowerCase()
      const tp = t.split("/")
      // don't parse messages from unsupported homestream version
      if (tp.length < 5 || tp[0] !== 'hs' || tp[1] !== '1') return
      if (!m) {
        if (p.retain && cb_deleted) {
          cb_deleted({
            topic: t,
            namespace: tp[2],
            object_id: tp[3],
            attribute: tp[4],
            to_namespace: tp[5],
            to_object_id: tp[6],
            to_attribute: tp[7],
            retain: true
          })
        }
        return
      }

      const message = JSON.parse(m.toString())

      // filter duplicates
      if (msg_cache[t] === message['ts']) return
      msg_cache[t] = message['ts']

      return cb({
        ts: message['ts'],
        topic: t,
        namespace: tp[2],
        object_id: tp[3],
        attribute: tp[4],
        to_namespace: tp[5],
        to_object_id: tp[6],
        to_attribute: tp[7],
        retain: p.retain,
        payload: m.toString(),
        data: message,
        val: message.val,
        context_ts: message.context_ts,
        context_topic: message.context_topic
      })
    })
  }
}

export default HomeStream