const { Client } = require('pg')
const { publishEvent, clearSensor } = require('../../publishEvent')
const { getUrl } = require('../../getUrl')

const CORE_ID = require('fs')
  .readFileSync(process.env.UID_FILE || '/sys/class/net/eth0/address', {encoding: 'utf8'})
  .trim().toLowerCase().replace(/:/g, '')

function index(req, res, next) {
  const client = new Client()
  client.connect()
  let q;
  if (req.query.type) {
    q = client.query('select id, room_id, name, type, battery, version from sensors where type = $1 order by name', [req.query.type])
  } else {
    q = client.query('select id, room_id, name, type, battery, version from sensors order by name')
  }

  q.then(r => res.send(r.rows))
    .catch(next)
    .then(() => client.end())
}

function manifest(req, res, next) {
  getUrl(`https://manifests.hiome.com/${CORE_ID}.json`).then(resp => res.send(resp)).catch(err => res.status(500).send(err))
}

function create(req, res, next) {
  const client = new Client()
  client.connect()
  client.query(`
    insert into sensors(id, room_id, name, type) values($1, $2, $3, $4)
      on conflict (id) do update set
        room_id = coalesce(excluded.room_id, sensors.room_id),
        name = coalesce(excluded.name, sensors.name),
        type = coalesce(excluded.type, sensors.type)
      returning id, room_id, name, type, battery, version
    `, [req.body.id, req.body.room_id, req.body.name, req.body.type])
      .then(r => res.send(r.rows[0]))
      .catch(next)
      .then(() => {
        publishEvent(`{"val": "created", "id": "${req.body.id}", "type": "sensor"}`)
        client.end()
      })
}

function del(req, res, next) {
  const client = new Client()
  client.connect()
  client.query('delete from sensors where id = $1 returning id, room_id, name, type, battery, version', [req.params.id])
    .then(r => res.send(r.rows[0]))
    .catch(next)
    .then(() => {
      publishEvent(`{"val": "deleted", "id": "${req.params.id}", "type": "sensor"}`)
      clearSensor(req.params.id)
      client.end()
    })
}

module.exports = { index, manifest, create, del }
