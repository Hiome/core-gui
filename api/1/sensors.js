const { Client } = require('pg')
const HomeStream = require('../../homestream')

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
 * @apiSuccess {String}  last_seen        timestamp of sensor's last message
 * @apiSuccess {Number}  sensitivity      the sensor's sensitivity level
 * @apiSuccessExample {json} Success-Response:
 *    {
 *      "id": "1",
 *      "room_id": "1556767182::1556767178",
 *      "name": "Living Room <-> Bedroom",
 *      "type": "door",
 *      "battery": null,
 *      "version": "V0.7.12",
 *      "last_seen": "2020-04-24 18:31:07.706785",
 *      "sensitivity": 0.9
 *    }
 */
function index(req, res, next) {
  const client = new Client()
  client.connect()
  let q;
  if (req.query.type) {
    q = client.query('select id, room_id, name, type, battery, version, last_seen, sensitivity from sensors where type = $1 order by name', [req.query.type])
  } else {
    q = client.query('select id, room_id, name, type, battery, version, last_seen, sensitivity from sensors order by name')
  }

  q.then(r => res.send(r.rows))
    .catch(next)
    .then(() => client.end())
}

/**
 * @api {get} /sensors/:id  Show a specific sensor
 * @apiVersion 1.0.0
 * @apiName Show
 * @apiGroup Sensors
 *
 * @apiParam {String}    id               id of the sensor
 * @apiSuccess {String}  id               the sensor's id
 * @apiSuccess {String}  room_id          the sensor's room's id
 * @apiSuccess {String}  name             the sensor's name
 * @apiSuccess {String}  type             the sensor's type
 * @apiSuccess {String}  battery          the sensor's battery level
 * @apiSuccess {String}  version          the sensor's version
 * @apiSuccess {String}  last_seen        timestamp of sensor's last message
 * @apiSuccess {Number}  sensitivity      the sensor's sensitivity level
 * @apiSuccessExample {json} Success-Response:
 *    {
 *      "id": "1",
 *      "room_id": "1556767182::1556767178",
 *      "name": "Living Room <-> Bedroom",
 *      "type": "door",
 *      "battery": null,
 *      "version": "V0.7.12",
 *      "last_seen": "2020-04-24 18:31:07.706785",
 *      "sensitivity": 0.9
 *    }
 */
function show(req, res, next) {
  const client = new Client()
  client.connect()
  client.query(`
    select * from sensors where id = $1
    `, [req.params.id])
    .then(r => res.send(r.rows[0]))
    .catch(next)
    .then(() => client.end())
}

/**
 * @api {post} /sensors Create a new sensor
 * @apiVersion 1.0.0
 * @apiName Create
 * @apiGroup Sensors
 * @apiSampleRequest off
 *
 * @apiParam {String}    id               Sensor's unique id
 * @apiParam {String}    type             Sensor's type
 * @apiParam {String}    [room_id]        Sensor's room id, if applicable
 * @apiParam {String}    [name]           Sensor's name, if applicable
 */
function create(req, res, next) {
  if (!req.body.id || !req.body.type) {
    res.status(422).send("id and type are required")
    return
  }

  HomeStream.write(`com.hiome/api/to/com.hiome/gateway/create_sensor`, {
    val: req.body.id,
    type: req.body.type,
    room_id: req.body.room_id,
    name: req.body.name
  })
  res.sendStatus(200)
}

/**
 * @api {put} /sensors/:id Update a sensor
 * @apiVersion 1.0.0
 * @apiName Update
 * @apiGroup Sensors
 * @apiSampleRequest off
 * @apiDescription This endpoint supports partial updates, meaning you can pass only the attribute(s) you want to change to leave the others as is.
 *
 * @apiParam {String}    id               Sensor's unique id
 * @apiParam {String}    [room_id]        Sensor's room id
 * @apiParam {String}    [name]           Sensor's name
 * @apiParam {Number}    [sensitivity]    Sensor's sensitivity level
 */
function update(req, res, next) {
  if (req.body.room_id)
    HomeStream.write(`com.hiome/api/to/com.hiome/${req.params.id}/room`, req.body.room_id)
  if (req.body.name)
    HomeStream.write(`com.hiome/api/to/com.hiome/${req.params.id}/name`, req.body.name)

  if (!isNaN(parseFloat(req.body.sensitivity))) {
    const client = new Client()
    client.connect()
    client.query(`
      update sensors set
        sensitivity = coalesce($2, sensors.sensitivity)
      where id = $1
      `, [req.params.id, parseFloat(req.body.sensitivity)])
        .then(r => res.sendStatus(200))
        .catch(next)
        .then(() => client.end())
  } else {
    res.sendStatus(200)
  }
}

/**
 * @api {delete} /sensors/:id Delete a sensor
 * @apiVersion 1.0.0
 * @apiName Delete
 * @apiGroup Sensors
 * @apiSampleRequest off
 *
 * @apiParam {String}    id               Sensor's unique id
 */
function del(req, res, next) {
  HomeStream.write(`com.hiome/api/to/com.hiome/${req.params.id}/connected`, 'delete')
  res.sendStatus(200)
}

module.exports = { index, show, create, update, del }
