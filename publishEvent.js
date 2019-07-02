const mqtt = require('mqtt')

function publishEvent(msg) {
  if (process.env.NODE_ENV === 'production') {
    const client = mqtt.connect('mqtt://localhost:1883')
    client.on('connect', () => client.publish('hiome/1/api', msg, () => client.end()))
  }
}

function clearSensor(sensorId) {
  if (process.env.NODE_ENV === 'production') {
    const client = mqtt.connect('mqtt://localhost:1883')
    client.on('connect', () => client.publish(`hiome/1/sensor/${sensorId}`, '', {retain: true}, () => client.end()))
  }
}

module.exports = { publishEvent, clearSensor }
