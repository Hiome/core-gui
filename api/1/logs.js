const { Client } = require('pg')
const publishEvent = require('../../publishEvent')

function index(req, res, next) {
  const pageSize = req.query.size || 50
  const page = req.query.page || 0
  const client = new Client()
  client.connect()
  client.query(`
    select id, event_type, object_type, object_id, message, level, occurred_at
      from logs where level IN ('info', 'warning')
      order by occurred_at desc
      limit $1 offset $2
    `, [pageSize, page * pageSize])
      .then(r => res.send(r.rows))
      .catch(next)
      .then(() => client.end())
}

function show(req, res, next) {
  const pageSize = req.query.size || 50
  const page = req.query.page || 0
  const client = new Client()
  client.connect()
  client.query(`
    select id, event_type, object_type, object_id, message, level, occurred_at
      from logs where
        object_type = $1 AND
        object_id = $2 AND
        level IN ('info', 'warning')
      order by occurred_at desc
      limit $3 offset $4
    `, [req.params.type, req.params.id, pageSize, page * pageSize])
      .then(r => res.send(r.rows))
      .catch(next)
      .then(() => client.end())
}

module.exports = { index, show }
