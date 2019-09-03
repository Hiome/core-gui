const { Client } = require('pg')
const { publishEvent, clearSensor } = require('../../publishEvent')

function index(req, res, next) {
  const client = new Client()
  client.connect()
  const query = req.query.include_hidden === 'true' ?
      'select * from rooms order by name' :
      'select * from rooms where hidden is not true order by name'
  client.query(query)
    .then(r => res.send(r.rows))
    .catch(next)
    .then(() => client.end())
}

function show(req, res, next) {
  const client = new Client()
  client.connect()
  client.query(`
    select * from rooms where rooms.id = $1
    `, [req.params.id])
    .then(r => res.send(r.rows[0]))
    .catch(next)
    .then(() => client.end())
}

function doors(req, res, next) {
  const client = new Client()
  client.connect()
  client.query(`
    select id, room_id, name, type, battery, version from sensors
      where type = 'door' and (room_id like $1 OR room_id like $2)
    `, [`${req.params.id}::%`, `%::${req.params.id}`])
    .then(r => res.send(r.rows))
    .catch(next)
    .then(() => client.end())
}

function create(req, res, next) {
  const client = new Client()
  client.connect()
  client.query(`
    insert into rooms(id, name, occupancy_count, hidden) values($1, $2, $3, $4)
      on conflict (id) do update set
        name = coalesce(excluded.name, rooms.name),
        occupancy_count = coalesce(excluded.occupancy_count, rooms.occupancy_count),
        hidden = coalesce(excluded.hidden, rooms.hidden)
      returning *
    `, [req.body.id, req.body.name, req.body.occupancy_count, req.body.hidden])
      .then(r => res.send(r.rows[0]))
      .catch(next)
      .then(() => {
        publishEvent(`{"val": "created", "id": "${req.body.id}", "type": "room"}`)
        client.end()
      })
}

function update(req, res, next) {
  const client = new Client()
  client.connect()
  client.query(`
    update rooms set
      name = coalesce($2, rooms.name),
      occupancy_count = coalesce($3, rooms.occupancy_count),
      hidden = coalesce($4, rooms.hidden)
    where id = $1
    returning *
    `, [req.params.id, req.body.name, req.body.occupancy_count, req.body.hidden])
      .then(r => res.send(r.rows[0]))
      .catch(next)
      .then(() => {
        if (req.body.hidden) {
          publishEvent(`{"val": "hidden", "id": "${req.params.id}", "type": "room"}`)
          clearSensor(`${req.params.id}:occupancy`)
        } else {
          publishEvent(`{"val": "updated", "id": "${req.params.id}", "type": "room"}`)
        }
        client.end()
      })
}

function del(req, res, next) {
  const client = new Client()
  client.connect()
  client.query('delete from rooms where id = $1 returning *', [req.params.id])
    .then(r => res.send(r.rows[0]))
    .catch(next)
    .then(() => {
      publishEvent(`{"val": "deleted", "id": "${req.params.id}", "type": "room"}`)
      clearSensor(`${req.params.id}:occupancy`)
      client.end()
    })
}

module.exports = { index, show, doors, create, update, del }
