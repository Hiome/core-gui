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

function show(req, res, next) {
  const client = new Client()
  client.connect()
  client.query(`
    select rooms.id, rooms.name, rooms.occupancy_count, count(sensors.id) as doors from rooms
      inner join sensors on
        sensors.type = 'door' and
        (sensors.room_id like $2 OR sensors.room_id like $3)
      where rooms.id = $1
      group by rooms.id, rooms.name, rooms.occupancy_count
    `, [req.params.id, `${req.params.id}::%`, `%::${req.params.id}`])
    .then(r => res.send(r.rows[0]))
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
      occupancy_count = coalesce($3, rooms.occupancy_count)
    where id = $1
    returning *
    `, [req.params.id, req.body.name, req.body.occupancy_count])
      .then(r => res.send(r.rows[0]))
      .catch(next)
      .then(() => {
        publishEvent(`{"val": "updated", "id": "${req.params.id}", "type": "room"}`)
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
      client.end()
    })
}

module.exports = { index, show, create, update, del }
