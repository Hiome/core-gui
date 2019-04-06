const { Client } = require('pg')
const mqtt = require('mqtt')

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
        name = excluded.name,
        occupancy_count = excluded.occupancy_count
      returning *
    `, [req.body.id, req.body.name, req.body.occupancy_count])
      .then(r => res.send(r.rows[0]))
      .catch(next)
      .then(() => {
        if (process.env.NODE_ENV === 'production') {
          mqtt.connect('mqtt://localhost:1883').publish('hiome/1/gui/cmd',
            `{"val": "updated", "id": "${req.body.id}", "type": "room"}`).end()
        }
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
      if (process.env.NODE_ENV === 'production') {
        mqtt.connect('mqtt://localhost:1883').publish('hiome/1/gui/cmd',
          `{"val": "deleted", "id": "${req.params.id}", "type": "room"}`).end()
      }
      client.end()
    })
}

module.exports = { index, create, del }
