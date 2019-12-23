const { Client } = require('pg')
const { publishEvent, clearSensor } = require('../../publishEvent')

/**
 * @api {get} /rooms Get all rooms
 * @apiVersion 1.0.0
 * @apiName Index
 * @apiGroup Rooms
 *
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
 * @apiParam {Number}    occupancy_count  Room's current occupancy count, usually 0
 * @apiParam {Boolean}   hidden           Room's visibility, true only if all doors in the room are covered
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
function create(req, res, next) {
  const client = new Client()
  client.connect()
  client.query(`
    insert into rooms(id, name, occupancy_count, hidden) values($1, $2, $3, $4)
      on conflict (id) do update set
        name = coalesce(excluded.name, rooms.name),
        occupancy_count = coalesce(excluded.occupancy_count, rooms.occupancy_count),
        hidden = coalesce(excluded.hidden, rooms.hidden)
      returning *
    `, [req.body.id, req.body.name, req.body.occupancy_count, req.body.hidden])
      .then(r => res.send(r.rows[0]))
      .catch(next)
      .then(() => {
        publishEvent(`{"val": "created", "id": "${req.body.id}", "type": "room"}`)
        client.end()
      })
}

/**
 * @api {put} /rooms/:id Update an existing room
 * @apiVersion 1.0.0
 * @apiName Update
 * @apiGroup Rooms
 *
 * @apiParam {String}    id               Room's unique id
 * @apiParam {String}    name             Room's name
 * @apiParam {Number}    occupancy_count  Room's current occupancy count, usually 0
 * @apiParam {Boolean}   hidden           Room's visibility, true only if all doors in the room are covered
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
function update(req, res, next) {
  const client = new Client()
  client.connect()
  client.query(`
    update rooms set
      name = coalesce($2, rooms.name),
      occupancy_count = coalesce($3, rooms.occupancy_count),
      hidden = coalesce($4, rooms.hidden)
    where id = $1
    returning *
    `, [req.params.id, req.body.name, req.body.occupancy_count, req.body.hidden])
      .then(r => res.send(r.rows[0]))
      .catch(next)
      .then(() => {
        if (req.body.hidden) {
          publishEvent(`{"val": "hidden", "id": "${req.params.id}", "type": "room"}`)
          clearSensor(`${req.params.id}:occupancy`)
        } else {
          let resp = {"val": "updated", "id": req.params.id, "type": "room", "count": req.body.occupancy_count || 0, "hidden": req.body.hidden}
          publishEvent(JSON.stringify(resp))
        }
        client.end()
      })
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
  const client = new Client()
  client.connect()
  client.query('delete from rooms where id = $1 returning *', [req.params.id])
    .then(r => res.send(r.rows[0]))
    .catch(next)
    .then(() => {
      publishEvent(`{"val": "deleted", "id": "${req.params.id}", "type": "room"}`)
      clearSensor(`${req.params.id}:occupancy`)
      client.end()
    })
}

module.exports = { index, show, doors, create, update, del }
