const { Client } = require('pg')

/**
 * @api {get} /:topic/:from   Read events from this topic's log, starting from the given time
 * @apiVersion 1.0.0
 * @apiName Index
 * @apiGroup Events
 * @apiDescription Read log from any valid HomeStream v1 topic
 * These follow the format of hs/1/:namespace:object_id/:attribute or hs/1/:namespace:object_id/to/:to_namespace/:to_object_id/:to_attribute
 *
 * For example, to see historical occupancy changes in room 2 since 1589686339565,
 * you would view /api/1/hs/1/com.hiome/room_2/occupancy/1589686339565
 *
 * @apiParam {String}    topic            Any valid HomeStream topic. Replace + wildcard with '~'
 * @apiParam {Number}    from             timestamp (in milliseconds since epoch) to start reading from
 * @apiParam {Number}    [until=now]      timestamp (in milliseconds since epoch) to stop reading, defaults to current time
 * @apiParam {Number}    [limit=1000]     max number of events to return, even if we didn't reach "until" timestamp
 * @apiParam {Boolean}   [reverse=false]  if "true", events will be returned in reverse chronological order
 * @apiSuccess {Number}  ts               timestamp of the event, as milliseconds since epoch
 * @apiSuccess {String}  topic            topic where event was published
 * @apiSuccess {String}  namespace        namespace of event
 * @apiSuccess {String}  object_id        object that published this event
 * @apiSuccess {String}  attribute        the attribute of the event
 * @apiSuccess {String}  payload          full json of the payload, as a string
 * @apiSuccess {Boolean}  retain          true if this event was a state change and retained
 * @apiSuccess {Number}  context_ts       if this event occurred in resposne to another, ts of the parent event
 * @apiSuccess {String}  context_topic    if this event occurred in resposne to another, topic of the parent event
 * @apiSuccessExample {json} Success-Response:
 *    {
 *      "ts": 1556767182,
 *      "topic":"hs/1/com.hiome/room_1578349369/occupancy",
 *      "namespace":"com.hiome",
 *      "object_id":"room_1578349369",
 *      "attribute":"occupancy",
 *      "payload":"{'val':0,'ts':1556767182}",
 *      "retain":true
 *    }
 */
function index(req, res, next) {
  const stop_ts = req.query.until || Date.now()
  const limit = req.query.limit || 1000
  const sort = req.query.reverse === 'true' ? 'desc' : 'asc'
  const args = [req.params.from, stop_ts, limit]
  let namespace_filter = object_filter = attr_filter = ''
  if (req.params.namespace !== '~') {
    args.push(req.params.namespace)
    namespace_filter = `and namespace = $${args.length}`
  }
  if (req.params.object_id !== '~') {
    args.push(req.params.object_id)
    object_filter = `and object_id = $${args.length}`
  }
  if (req.params.attr === '~') {
    attr_filter = `and attribute <> 'to'`
  } else if (req.params.attr !== '~~') {
    args.push(req.params.attr)
    attr_filter = `and attribute = $${args.length}`
  }

  const client = new Client()
  client.connect()
  client.query(`
    SELECT
      ts, topic, namespace, object_id, attribute, to_namespace, to_object_id, to_attribute,
      payload AS data, retain, context_ts, context_topic
    FROM events
      where ts > $1 and ts <= $2 ${namespace_filter} ${object_filter} ${attr_filter}
      order by ts ${sort} limit $3
    `, args)
      .then(r => res.send(r.rows))
      .catch(next)
      .then(() => client.end())
}

function index_commands(req, res, next) {
  const stop_ts = req.query.until || Date.now()
  const limit = req.query.limit || 1000
  const sort = req.query.reverse === 'true' ? 'desc' : 'asc'
  const args = [req.params.from, stop_ts, limit]
  let namespace_filter = object_filter = to_namespace_filter = to_object_filter = to_attr_filter = ''
  if (req.params.namespace !== '~') {
    args.push(req.params.namespace)
    namespace_filter = `and namespace = $${args.length}`
  }
  if (req.params.object_id !== '~') {
    args.push(req.params.object_id)
    object_filter = `and object_id = $${args.length}`
  }
  if (req.params.to_namespace !== '~') {
    args.push(req.params.to_namespace)
    to_namespace_filter = `and to_namespace = $${args.length}`
  }
  if (req.params.to_object_id !== '~') {
    args.push(req.params.to_object_id)
    to_object_filter = `and to_object_id = $${args.length}`
  }
  if (req.params.to_attr !== '~') {
    args.push(req.params.to_attr)
    to_attr_filter = `and to_attribute = $${args.length}`
  }

  const client = new Client()
  client.connect()
  client.query(`
    SELECT
      ts, topic, namespace, object_id, attribute, to_namespace, to_object_id, to_attribute,
      payload AS data, retain, context_ts, context_topic
    FROM events
      where ts > $1 and ts <= $2 ${namespace_filter} ${object_filter} and attribute = 'to'
        ${to_namespace_filter} ${to_object_filter} ${to_attr_filter}
      order by ts ${sort} limit $3
    `, args)
      .then(r => res.send(r.rows))
      .catch(next)
      .then(() => client.end())
}

/**
 * @api {get} /:topic   Read latest retained state of topic(s)
 * @apiVersion 1.0.0
 * @apiName Retained
 * @apiGroup Events
 * @apiDescription This will return at most 1 event per matching topic, which is that topic's most recent retained state.
 *
 * @apiParam {String}    topic            Any valid HomeStream topic. Replace + wildcard with '~'
 * @apiSuccess {Number}  ts               timestamp of the event, as milliseconds since epoch
 * @apiSuccess {String}  topic            topic where event was published
 * @apiSuccess {String}  namespace        namespace of event
 * @apiSuccess {String}  object_id        object that published this event
 * @apiSuccess {String}  attribute        the attribute of the event
 * @apiSuccess {String}  payload          full json of the payload, as a string
 * @apiSuccess {Boolean}  retain          true if this event was a state change and retained
 * @apiSuccess {Number}  context_ts       if this event occurred in resposne to another, ts of the parent event
 * @apiSuccess {String}  context_topic    if this event occurred in resposne to another, topic of the parent event
 * @apiSuccessExample {json} Success-Response:
 *    {
 *      "ts": 1556767182,
 *      "topic":"hs/1/com.hiome/room_1578349369/occupancy",
 *      "namespace":"com.hiome",
 *      "object_id":"room_1578349369",
 *      "attribute":"occupancy",
 *      "payload":"{'val':0,'ts':1556767182}",
 *      "retain":true
 *    }
 */
function retained(req, res, next) {
  const args = []
  let namespace_filter = object_filter = attr_filter = ''
  if (req.params.namespace !== '~') {
    args.push(req.params.namespace)
    namespace_filter = `and namespace = $${args.length}`
  }
  if (req.params.object_id !== '~') {
    args.push(req.params.object_id)
    object_filter = `and object_id = $${args.length}`
  }
  if (req.params.attr !== '~' && req.params.attr !== '~~') {
    args.push(req.params.attr)
    attr_filter = `and attribute = $${args.length}`
  }

  const client = new Client()
  client.connect()
  client.query(`
    SELECT DISTINCT ON (topic)
      ts, topic, namespace, object_id, attribute, to_namespace, to_object_id, to_attribute,
      payload AS data, retain, context_ts, context_topic
    FROM events
      where retain IS TRUE ${namespace_filter} ${object_filter} ${attr_filter}
      ORDER BY topic, ts DESC
    `, args)
      .then(r => res.send(r.rows))
      .catch(next)
      .then(() => client.end())
}

module.exports = { index, index_commands, retained }
