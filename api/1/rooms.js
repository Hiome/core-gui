const { Client } = require('pg')
const HomeStream = require('../../homestream')
const parseBool = require('../../parseBool')

/**
 * @api {get} /rooms Get all rooms
 * @apiVersion 1.0.0
 * @apiName Index
 * @apiGroup Rooms
 *
 * @apiParam {Boolean}   [include_hidden=false]   include hidden rooms in response
 * @apiSuccess {String}  id               the room's id
 * @apiSuccess {String}  name             the room's name
 * @apiSuccess {Number}  occupancy_count  the number of people in the room right now
 * @apiSuccess {Boolean} hidden           whether or not this room is hidden from Hiome because not all doors are covered
 * @apiSuccessExample {json} Success-Response:
 *  [
 *    {
 *      "id": "1556767178",
 *      "name": "Living Room",
 *      "occupancy_count": 1,
 *      "hidden": false
 *    }
 *  ]
 */
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

/**
 * @api {get} /rooms/:id Show a specific room
 * @apiVersion 1.0.0
 * @apiName Show
 * @apiGroup Rooms
 *
 * @apiParam {String}    id               Room's unique id
 * @apiSuccess {String}  id               the room's id
 * @apiSuccess {String}  name             the room's name
 * @apiSuccess {Number}  occupancy_count  the number of people in the room right now
 * @apiSuccess {Boolean} hidden           whether or not this room is hidden from Hiome because not all doors are covered
 * @apiSuccessExample {json} Success-Response:
 *    {
 *      "id": "1556767178",
 *      "name": "Living Room",
 *      "occupancy_count": 1,
 *      "hidden": false
 *    }
 */
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

/**
 * @api {get} /rooms/:id/doors Get all doors in a room
 * @apiVersion 1.0.0
 * @apiName Doors
 * @apiGroup Rooms
 *
 * @apiParam {String}    id               Room's unique id
 * @apiSuccess {String}  id               the door's id
 * @apiSuccess {String}  room_id          the room's id
 * @apiSuccess {String}  name             the door's name
 * @apiSuccess {String}  type             always "door"
 * @apiSuccess {String}  battery          battery level if a Hiome PowerPack is used
 * @apiSuccess {String}  version          current version number for this sensor
 * @apiSuccess {Number}  sensitivity      the door sensor's sensitivity level
 * @apiSuccessExample {json} Success-Response:
 *  [
 *    {
 *      "id": "1",
 *      "room_id": "1556767182::1556767178",
 *      "name": "Living Room <-> Bedroom",
 *      "type": "door",
 *      "battery": null,
 *      "version": "V0.7.12",
 *      "sensitivity": 0.9
 *    }
 *  ]
 */
function doors(req, res, next) {
  const client = new Client()
  client.connect()
  client.query(`
    select id, room_id, name, type, battery, version, sensitivity from sensors
      where type = 'door' and (room_id like $1 OR room_id like $2)
    `, [`${req.params.id}::%`, `%::${req.params.id}`])
    .then(r => res.send(r.rows))
    .catch(next)
    .then(() => client.end())
}

/**
 * @api {post} /rooms Create a new room
 * @apiVersion 1.0.0
 * @apiName Create
 * @apiGroup Rooms
 * @apiSampleRequest off
 *
 * @apiParam {String}    id               Room's unique id, usually the current unix timestamp in seconds
 * @apiParam {String}    name             Room's name
 * @apiParam {Number}    [occupancy_count=0]  Room's current occupancy count, usually 0
 * @apiParam {Boolean}   [hidden=false]   Room's visibility, true only if all doors in the room are covered
 */
function create(req, res, next) {
  if (!req.body.id || !req.body.name) {
    res.status(422).send("id and name are required")
    return
  }

  HomeStream.write(`com.hiome/api/to/com.hiome/gateway/create_room`, {
    val: req.body.id,
    name: req.body.name,
    occupancy: parseInt(req.body.occupancy_count),
    hidden: parseBool(req.body.hidden)
  })
  res.sendStatus(200)
}

/**
 * @api {put} /rooms/:id Update an existing room
 * @apiVersion 1.0.0
 * @apiName Update
 * @apiGroup Rooms
 * @apiDescription This endpoint supports partial updates, meaning you can pass only the attribute(s) you want to change to leave the others as is.
 *
 * @apiParam {String}    id                Room's unique id
 * @apiParam {String}    [name]            Room's name
 * @apiParam {Number}    [occupancy_count] Room's current occupancy count
 * @apiParam {Boolean}   [hidden]          Room's visibility, true only if all doors in the room are covered
 */
function update(req, res, next) {
  if (req.body.name)
    HomeStream.write(`com.hiome/api/to/com.hiome/${req.params.id}/name`, req.body.name)
  if (!isNaN(parseInt(req.body.occupancy_count)))
    HomeStream.write(`com.hiome/api/to/com.hiome/${req.params.id}/occupancy`, parseInt(req.body.occupancy_count))
  const hidden = parseBool(req.body.hidden)
  if (hidden !== null)
    HomeStream.write(`com.hiome/api/to/com.hiome/${req.params.id}/hidden`, hidden)

  res.sendStatus(200)
}

/**
 * @api {delete} /rooms/:id Delete a room
 * @apiVersion 1.0.0
 * @apiName Delete
 * @apiGroup Rooms
 * @apiSampleRequest off
 *
 * @apiParam {String}    id               Room's unique id
 * @apiSuccess {String}  id               the deleted room's id
 * @apiSuccess {String}  name             the deleted room's name
 * @apiSuccess {Number}  occupancy_count  the number of people in the deleted room right now
 * @apiSuccess {Boolean} hidden           whether or not this room was hidden from Hiome because not all doors are covered
 * @apiSuccessExample {json} Success-Response:
 *    {
 *      "id": "1556767178",
 *      "name": "Living Room",
 *      "occupancy_count": 1,
 *      "hidden": false
 *    }
 */
function del(req, res, next) {
  HomeStream.write(`com.hiome/api/to/com.hiome/${req.params.id}/connected`, 'delete')
  res.sendStatus(200)
}

module.exports = { index, show, doors, create, update, del }
