const { Client } = require('pg')
const HomeStream = require('../../homestream')

/**
 * @api {get} /entries List all entries from last 12 hours, up to 100
 * @apiVersion 1.0.0
 * @apiName Index
 * @apiGroup Entries
 *
 */
function index(req, res, next) {
  const client = new Client()
  client.connect()
  client.query('select sensor_id, corrected, is_valid, payload from entries where ts > $1 order by ts desc limit 100', [Date.now() - 43200000])
    .then(r => res.send(r.rows.map(x => {
      x.payload.sensor_id = x.sensor_id
      x.payload.corrected = x.corrected
      x.payload.is_valid = x.is_valid
      return x.payload
    }))).catch(next).then(() => client.end())
}

/**
 * @api {get} /entries/:id  Show entries from last 12 hours, up to 100, for a specific door
 * @apiVersion 1.0.0
 * @apiName Show
 * @apiGroup Entries
 *
 * @apiParam {String}    id               id of the sensor
 */
function show(req, res, next) {
  const client = new Client()
  client.connect()
  client.query(`
    select sensor_id, corrected, is_valid, payload from entries where sensor_id = $1 and ts > $2 order by ts desc limit 100
    `, [req.params.id, Date.now() - 43200000])
    .then(r => res.send(r.rows.map(x => {
      x.payload.sensor_id = x.sensor_id
      x.payload.corrected = x.corrected
      x.payload.is_valid = x.is_valid
      return x.payload
    }))).catch(next).then(() => client.end())
}

/**
 * @api {put} /entries/:id/:ts  Revert an entry
 * @apiVersion 1.0.0
 * @apiName Update
 * @apiGroup Entries
 * @apiSampleRequest off
 *
 * @apiParam {String}    id               Sensor's unique id
 * @apiParam {String}    ts               timestamp of the entry to revert
 */
function update(req, res, next) {
  HomeStream.write(`com.hiome/gui/to/com.hiome/${req.params.id}/entry`, {val: 'revert', 'entry_ts': req.params.ts})
  res.sendStatus(200)
}

module.exports = { index, show, update }
