const express = require('express')
const router = express.Router()

const logs = require('./logs')
router.get('/logs', logs.index)
router.get('/logs/debug', logs.debug)
router.get('/logs/:type/:id', logs.show)

const rooms = require('./rooms')
router.get('/rooms', rooms.index)
router.get('/rooms/:id', rooms.show)
router.get('/rooms/:id/doors', rooms.doors)
router.post('/rooms', rooms.create)
router.put('/rooms/:id', rooms.update)
router.delete('/rooms/:id', rooms.del)

const sensors = require('./sensors')
router.get('/sensors', sensors.index)
router.get('/sensors/:id', sensors.show)
router.post('/sensors', sensors.create)
router.put('/sensors/:id', sensors.update)
router.delete('/sensors/:id', sensors.del)

const events = require('./events')
router.get('/hs/1/:namespace/:object_id/:attr', events.latest)
router.get('/hs/1/:namespace/:object_id/:attr/:from', events.index)
router.get('/hs/1/:namespace/:object_id/to/:to_namespace/:to_object_id/:to_attr/:from', events.index_commands)

module.exports = router
