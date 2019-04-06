const { Client } = require('pg')

function index(req, res, next) {
  const client = new Client()
  client.connect()
  client.query('select * from sensors order by name')
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
      returning *
    `, [req.body.id, req.body.room_id, req.body.name, req.body.type])
      .then(r => res.send(r.rows[0]))
      .catch(next)
      .then(() => client.end())
}

function del(req, res, next) {
  const client = new Client()
  client.connect()
  const sensorId = parseInt(req.params.id);
  client.query('delete from sensors id = $1 returning *', [sensorId])
    .then(r => res.send(r.rows[0]))
    .catch(next)
    .then(() => client.end())
}

module.exports = { index, create, del }
