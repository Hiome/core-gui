const { Client } = require('pg')
const publishEvent = require('../../publishEvent')

function index(req, res, next) {
  const client = new Client()
  client.connect()
  client.query('select id, room_id, name, type, battery, version from sensors order by name')
    .then(r => res.send(r.rows))
    .catch(next)
    .then(() => client.end())
}

function create(req, res, next) {
  const client = new Client()
  client.connect()
  client.query(`
    insert into sensors(id, room_id, name, type) values($1, $2, $3, $4)
      on conflict (id) do update set
        room_id = excluded.room_id,
        name = excluded.name,
        type = excluded.type
      returning id, room_id, name, type, battery, version
    `, [req.body.id, req.body.room_id, req.body.name, req.body.type])
      .then(r => res.send(r.rows[0]))
      .catch(next)
      .then(() => {
        publishEvent(`{"val": "updated", "id": "${req.body.id}", "type": "sensor"}`)
        client.end()
      })
}

function del(req, res, next) {
  const client = new Client()
  client.connect()
  client.query('delete from sensors id = $1 returning id, room_id, name, type, battery, version', [req.params.id])
    .then(r => res.send(r.rows[0]))
    .catch(next)
    .then(() => {
      publishEvent(`{"val": "deleted", "id": "${req.params.id}", "type": "sensor"}`)
      client.end()
    })
}

module.exports = { index, create, del }
