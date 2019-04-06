const { Client } = require('pg')

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
      .then(() => client.end())
}

function del(req, res, next) {
  const client = new Client()
  client.connect()
  const roomId = parseInt(req.params.id);
  client.query('delete from rooms id = $1 returning *', [roomId])
    .then(r => res.send(r.rows[0]))
    .catch(next)
    .then(() => client.end())
}

module.exports = { index, create, del }
