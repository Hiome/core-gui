const { Client } = require('pg')

/**
 * @api {get} /logs Get all logs
 * @apiVersion 1.0.0
 * @apiName Index
 * @apiGroup Logs
 *
 * @apiParam {Number}    [page=0]         Page number to fetch, starting at 0
 * @apiParam {Number}    [size=50]        Number of lines to return per page
 * @apiSuccess {String}  id               the log line's unique id
 * @apiSuccess {String}  event_type       the type of event
 * @apiSuccess {String}  object_type      the type of object that generated this log
 * @apiSuccess {String}  object_id        the id of the object that generated this log
 * @apiSuccess {String}  message          the content of the log line
 * @apiSuccess {String}  level            the level of log (either debug, info, warning, or error)
 * @apiSuccess {String}  occurred_at      the timestamp of when the log occurred
 * @apiSuccessExample {json} Success-Response:
 *    {
 *      "id": "1",
 *      "event_type":"room_entered",
 *      "object_type":"room",
 *      "object_id":"1556767182",
 *      "message":"Somebody entered from Office. There is now 1 person in here.",
 *      "level": "info",
 *      "occurred_at":"2019-10-18T15:10:46.387Z"
 *    }
 */
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

/**
 * @api {get} /logs/:type/:id Get logs for an object
 * @apiVersion 1.0.0
 * @apiName Show
 * @apiGroup Logs
 *
 * @apiParam {String}    type             The object's type to filter to
 * @apiParam {String}    id               The object's id to filter to
 * @apiParam {Number}    [page=0]         Page number to fetch, starting at 0
 * @apiParam {Number}    [size=50]        Number of lines to return per page
 * @apiSuccess {String}  id               the log line's unique id
 * @apiSuccess {String}  event_type       the type of event
 * @apiSuccess {String}  object_type      the type of object that generated this log
 * @apiSuccess {String}  object_id        the id of the object that generated this log
 * @apiSuccess {String}  message          the content of the log line
 * @apiSuccess {String}  level            the level of log (either debug, info, warning, or error)
 * @apiSuccess {String}  occurred_at      the timestamp of when the log occurred
 * @apiSuccessExample {json} Success-Response:
 *    {
 *      "id": "1",
 *      "event_type":"room_entered",
 *      "object_type":"room",
 *      "object_id":"1556767182",
 *      "message":"Somebody entered from Office. There is now 1 person in here.",
 *      "level": "info",
 *      "occurred_at":"2019-10-18T15:10:46.387Z"
 *    }
 */
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
