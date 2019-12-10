const { Client } = require('pg')
const { publishEvent, clearSensor } = require('../../publishEvent')
const { getUrl } = require('../../getUrl')
const { exec } = require('child_process')

const CORE_ID = require('fs')
  .readFileSync(process.env.UID_FILE || '/sys/class/net/eth0/address', {encoding: 'utf8'})
  .trim().toLowerCase().replace(/:/g, '')

/**
 * @api {get} /sensors Get all sensors
 * @apiVersion 1.0.0
 * @apiName Index
 * @apiGroup Sensors
 *
 * @apiParam {String}    [type]           Filter to only sensor's of this type
 * @apiSuccess {String}  id               the sensor's id
 * @apiSuccess {String}  room_id          the sensor's room's id
 * @apiSuccess {String}  name             the sensor's name
 * @apiSuccess {String}  type             the sensor's type
 * @apiSuccess {String}  battery          the sensor's battery level
 * @apiSuccess {String}  version          the sensor's version
 * @apiSuccess {Number}  sensitivity      the sensor's sensitivity level
 * @apiSuccessExample {json} Success-Response:
 *    {
 *      "id": "1",
 *      "room_id": "1556767182::1556767178",
 *      "name": "Living Room <-> Bedroom",
 *      "type": "door",
 *      "battery": null,
 *      "version": "V0.7.12",
 *      "sensitivity": 0.9
 *    }
 */
function index(req, res, next) {
  const client = new Client()
  client.connect()
  let q;
  if (req.query.type) {
    q = client.query('select id, room_id, name, type, battery, version, sensitivity from sensors where type = $1 order by name', [req.query.type])
  } else {
    q = client.query('select id, room_id, name, type, battery, version, sensitivity from sensors order by name')
  }

  q.then(r => res.send(r.rows))
    .catch(next)
    .then(() => client.end())
}

function manifest(req, res, next) {
  getUrl(`https://manifests.hiome.com/${CORE_ID}.json`).then(resp => res.send(resp)).catch(err => res.status(500).send(err))
}

/**
 * @api {post} /sensors Create a new sensor
 * @apiVersion 1.0.0
 * @apiName Create
 * @apiGroup Sensors
 * @apiSampleRequest off
 *
 * @apiParam {String}    id               Sensor's unique id
 * @apiParam {String}    room_id          Sensor's room id
 * @apiParam {String}    name             Sensor's name
 * @apiParam {String}    type             Sensor's type
 * @apiParam {Number}    sensitivity      Sensor's sensitivity level
 * @apiSuccess {String}  id               the sensor's id
 * @apiSuccess {String}  room_id          the sensor's room's id
 * @apiSuccess {String}  name             the sensor's name
 * @apiSuccess {String}  type             the sensor's type
 * @apiSuccess {String}  battery          the sensor's battery level
 * @apiSuccess {String}  version          the sensor's version
 * @apiSuccess {Number}  sensitivity      the sensor's sensitivity level
 * @apiSuccessExample {json} Success-Response:
 *    {
 *      "id": "1",
 *      "room_id": "1556767182::1556767178",
 *      "name": "Living Room <-> Bedroom",
 *      "type": "door",
 *      "battery": null,
 *      "version": null,
 *      "sensitivity": 0.9
 *    }
 */
function create(req, res, next) {
  const client = new Client()
  client.connect()
  client.query(`
    insert into sensors(id, room_id, name, type, sensitivity) values($1, $2, $3, $4, $5)
      on conflict (id) do update set
        room_id = coalesce(excluded.room_id, sensors.room_id),
        name = coalesce(excluded.name, sensors.name),
        type = coalesce(excluded.type, sensors.type),
        sensitivity = coalesce(excluded.sensitivity, sensors.sensitivity)
      returning id, room_id, name, type, battery, version, sensitivity
    `, [req.body.id, req.body.room_id, req.body.name, req.body.type, req.body.sensitivity])
      .then(r => res.send(r.rows[0]))
      .catch(next)
      .then(() => {
        publishEvent(`{"val": "created", "id": "${req.body.id}", "type": "sensor"}`)
        client.end()
      })
}

/**
 * @api {put} /sensors/:id Update a sensor
 * @apiVersion 1.0.0
 * @apiName Update
 * @apiGroup Sensors
 * @apiSampleRequest off
 *
 * @apiParam {String}    id               Sensor's unique id
 * @apiParam {String}    room_id          Sensor's room id
 * @apiParam {String}    name             Sensor's name
 * @apiParam {Number}    sensitivity      Sensor's sensitivity level
 * @apiSuccess {String}  id               the sensor's id
 * @apiSuccess {String}  room_id          the sensor's room's id
 * @apiSuccess {String}  name             the sensor's name
 * @apiSuccess {String}  type             the sensor's type
 * @apiSuccess {String}  battery          the sensor's battery level
 * @apiSuccess {String}  version          the sensor's version
 * @apiSuccess {Number}  sensitivity      the sensor's sensitivity level
 * @apiSuccessExample {json} Success-Response:
 *    {
 *      "id": "1",
 *      "room_id": "1556767182::1556767178",
 *      "name": "Living Room <-> Bedroom",
 *      "type": "door",
 *      "battery": null,
 *      "version": null,
 *      "sensitivity": 0.9
 *    }
 */
function update(req, res, next) {
  const client = new Client()
  client.connect()
  client.query(`
    update sensors set
      room_id = coalesce($2, sensors.room_id),
      name = coalesce($3, sensors.name),
      sensitivity = coalesce($4, sensors.sensitivity)
    where id = $1
    returning id, room_id, name, type, battery, version, sensitivity
    `, [req.params.id, req.body.room_id, req.body.name, req.body.sensitivity])
      .then(r => res.send(r.rows[0]))
      .catch(next)
      .then(() => {
        publishEvent(`{"val": "updated", "id": "${req.params.id}", "type": "sensor"}`)
        client.end()
      })
}

function updateFirmware(req, res, next) {
  exec('/home/pi/hubsetup/bin/install_firmware', (err, stdout, stderr) => {
    if (err) {
      // node couldn't execute the command
      res.status(500).send(err)
      return
    }
    if (stderr) {
      res.send(`error: ${stderr}`)
    } else {
      if (stdout === null || stdout.trim().length === 0) res.send('no updates')
      else if (stdout.test(/SUCCESS/)) res.send('done updating')
      else res.send(stdout)
    }
  })
}

/**
 * @api {delete} /sensors/:id Delete a sensor
 * @apiVersion 1.0.0
 * @apiName Delete
 * @apiGroup Sensors
 * @apiSampleRequest off
 *
 * @apiParam {String}    id               Sensor's unique id
 * @apiSuccess {String}  id               the deleted sensor's id
 * @apiSuccess {String}  room_id          the deleted sensor's room's id
 * @apiSuccess {String}  name             the deleted sensor's name
 * @apiSuccess {String}  type             the deleted sensor's type
 * @apiSuccess {String}  battery          the deleted sensor's battery level
 * @apiSuccess {String}  version          the deleted sensor's version
 * @apiSuccess {Number}  sensitivity      the sensor's sensitivity level
 * @apiSuccessExample {json} Success-Response:
 *    {
 *      "id": "1",
 *      "room_id": "1556767182::1556767178",
 *      "name": "Living Room <-> Bedroom",
 *      "type": "door",
 *      "battery": null,
 *      "version": "V0.7.12",
 *      "sensitivity": 0.9
 *    }
 */
function del(req, res, next) {
  const client = new Client()
  client.connect()
  client.query('delete from sensors where id = $1 returning id, room_id, name, type, battery, version, sensitivity', [req.params.id])
    .then(r => res.send(r.rows[0]))
    .catch(next)
    .then(() => {
      publishEvent(`{"val": "deleted", "id": "${req.params.id}", "type": "sensor"}`)
      clearSensor(req.params.id)
      client.end()
    })
}

module.exports = { index, manifest, create, update, updateFirmware, del }
