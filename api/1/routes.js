const express = require('express')
const router = express.Router()

const rooms = require('./rooms')
router.get('/rooms', rooms.index)
router.post('/rooms', rooms.create)
router.put('/rooms/:id', rooms.update)
router.delete('/rooms/:id', rooms.del)

const sensors = require('./sensors')
router.get('/sensors', sensors.index)
router.post('/sensors', sensors.create)
router.delete('/sensors/:id', sensors.del)

module.exports = router
