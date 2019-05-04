const { Client } = require('pg')
const publishEvent = require('../../publishEvent')

function index(req, res, next) {
  const client = new Client()
  client.connect()
  client.query('select * from rooms order by name')
    .then(r => res.send(r.rows))
    .catch(next)
    .then(() => client.end())
}

function create(req, res, next) {
  const client = new Client()
  client.connect()
  client.query(`
    insert into rooms(id, name, occupancy_count) values($1, $2, $3)
      on conflict (id) do update set
        name = coalesce(excluded.name, rooms.name),
        occupancy_count = coalesce(excluded.occupancy_count, rooms.occupancy_count)
      returning *
    `, [req.body.id, req.body.name, req.body.occupancy_count])
      .then(r => res.send(r.rows[0]))
      .catch(next)
      .then(() => {
        publishEvent(`{"val": "updated", "id": "${req.body.id}", "type": "room"}`)
        client.end()
      })
}

function del(req, res, next) {
  const client = new Client()
  client.connect()
  client.query('delete from rooms id = $1 returning *', [req.params.id])
    .then(r => res.send(r.rows[0]))
    .catch(next)
    .then(() => {
      publishEvent(`{"val": "deleted", "id": "${req.params.id}", "type": "room"}`)
      client.end()
    })
}

module.exports = { index, create, del }
