const { Client } = require('pg')

/**
 * @api {get} /:topic/:from   Read events from this topic's log, starting from the given time
 * @apiVersion 1.0.0
 * @apiName Index
 * @apiGroup Events
 * @apiDescription Read log from any valid HomeStream v1 topic
 * These follow the format of hs/1/:namespace:object_id/:attribute or hs/1/:namespace:object_id/to/:to_namespace/:to_object_id/:to_attribute
 *
 * For example, to see historical occupancy changes in room 2 since 1589686339565,
 * you would view /api/1/hs/1/com.hiome/room_2/occupancy/1589686339565
 *
 * @apiParam {String}    topic            Any valid HomeStream topic. Replace + wildcard with '~'
 * @apiParam {Number}    from             timestamp (in milliseconds since epoch) to start reading from
 * @apiParam {Number}    [until=now]      timestamp (in milliseconds since epoch) to stop reading, defaults to current time
 * @apiParam {Number}    [limit=1000]     max number of events to return, even if we didn't reach "until" timestamp
 * @apiParam {Boolean}   [reverse=false]  if "true", events will be returned in reverse chronological order
 * @apiSuccess {Number}  ts               timestamp of the event, as milliseconds since epoch
 * @apiSuccess {String}  topic            topic where event was published
 * @apiSuccess {String}  namespace        namespace of event
 * @apiSuccess {String}  object_id        object that published this event
 * @apiSuccess {String}  attribute        the attribute of the event
 * @apiSuccess {String}  payload          full json of the payload, as a string
 * @apiSuccess {Boolean}  retain          true if this event was a state change and retained
 * @apiSuccess {Number}  context_ts       if this event occurred in resposne to another, ts of the parent event
 * @apiSuccess {String}  context_topic    if this event occurred in resposne to another, topic of the parent event
 * @apiSuccessExample {json} Success-Response:
 *    {
 *      "ts": 1556767182,
 *      "topic":"hs/1/com.hiome/room_1578349369/occupancy",
 *      "namespace":"com.hiome",
 *      "object_id":"room_1578349369",
 *      "attribute":"occupancy",
 *      "payload":"{'val':0,'ts':1556767182}",
 *      "retain":true
 *    }
 */
function index(req, res, next) {
  const stop_ts = req.query.until || Date.now()
  const limit = req.query.limit || 1000
  const sort = req.query.reverse === 'true' ? 'desc' : 'asc'
  const namespace_filter = req.params.namespace === '~' ? '' : 'and namespace = $4'
  const object_filter = req.params.object_id === '~' ? '' : 'and object_id = $5'
  const attr_filter = req.params.attr === '~~' ? '' : (req.params.attr === '~' ? "and attribute <> 'to'" : 'and attribute = $6')
  const client = new Client()
  client.connect()
  client.query(`
    select * from events
      where ts > $1 and ts <= $2 ${namespace_filter} ${object_filter} ${attr_filter}
      order by ts ${sort} limit $3
    `, [req.params.from, stop_ts, limit, req.params.namespace, req.params.object_id, req.params.attr])
      .then(r => res.send(r.rows))
      .catch(next)
      .then(() => client.end())
}

function index_commands(req, res, next) {
  const stop_ts = req.query.until || Date.now()
  const limit = req.query.limit || 1000
  const sort = req.query.reverse === 'true' ? 'desc' : 'asc'
  const namespace_filter = req.params.namespace === '~' ? '' : 'and namespace = $4'
  const object_filter = req.params.object_id === '~' ? '' : 'and object_id = $5'
  const to_namespace_filter = req.params.to_namespace === '~' ? '' : 'and to_namespace = $6'
  const to_object_filter = req.params.to_object_id === '~' ? '' : 'and to_object_id = $7'
  const to_attr_filter = req.params.to_attr === '~' ? '' : 'and to_attribute = $8'
  const client = new Client()
  client.connect()
  client.query(`
    select * from events
      where ts > $1 and ts <= $2 ${namespace_filter} ${object_filter} and attribute = 'to'
        ${to_namespace_filter} ${to_object_filter} ${to_attr_filter}
      order by ts ${sort} limit $3
    `, [req.params.from, stop_ts, limit, req.params.namespace, req.params.object_id,
        req.params.to_namespace, req.params.to_object_id, req.params.to_attr])
      .then(r => res.send(r.rows))
      .catch(next)
      .then(() => client.end())
}

/**
 * @api {get} /:topic/retained   Read latest retained state of topic(s)
 * @apiVersion 1.0.0
 * @apiName Retained
 * @apiGroup Events
 * @apiDescription This will return at most 1 event per matching topic, which is that topic's most recent retained state.
 *
 * @apiParam {String}    topic            Any valid HomeStream topic. Replace + wildcard with '~'
 * @apiSuccess {Number}  ts               timestamp of the event, as milliseconds since epoch
 * @apiSuccess {String}  topic            topic where event was published
 * @apiSuccess {String}  namespace        namespace of event
 * @apiSuccess {String}  object_id        object that published this event
 * @apiSuccess {String}  attribute        the attribute of the event
 * @apiSuccess {String}  payload          full json of the payload, as a string
 * @apiSuccess {Boolean}  retain          true if this event was a state change and retained
 * @apiSuccess {Number}  context_ts       if this event occurred in resposne to another, ts of the parent event
 * @apiSuccess {String}  context_topic    if this event occurred in resposne to another, topic of the parent event
 * @apiSuccessExample {json} Success-Response:
 *    {
 *      "ts": 1556767182,
 *      "topic":"hs/1/com.hiome/room_1578349369/occupancy",
 *      "namespace":"com.hiome",
 *      "object_id":"room_1578349369",
 *      "attribute":"occupancy",
 *      "payload":"{'val':0,'ts':1556767182}",
 *      "retain":true
 *    }
 */
function retained(req, res, next) {
  const namespace_filter = req.params.namespace === '~' ? '' : 'and namespace = $1'
  const object_filter = req.params.object_id === '~' ? '' : 'and object_id = $2'
  const attr_filter = (req.params.attr === '~' || req.params.attr === '~~') ? '' : 'and attribute = $3'
  const client = new Client()
  client.connect()
  client.query(`
    select DISTINCT ON (topic) * from events
      where retain IS TRUE ${namespace_filter} ${object_filter} ${attr_filter}
      ORDER BY topic, ts DESC
    `, [req.params.namespace, req.params.object_id, req.params.attr])
      .then(r => res.send(r.rows))
      .catch(next)
      .then(() => client.end())
}

module.exports = { index, index_commands, retained }
