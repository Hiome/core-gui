const MACHINEID = process.env.NODE_ENV === 'production' ? require('fs').readFileSync('/sys/class/net/eth0/address', 'utf8').trim() : 'local'
const mqtt = require('mqtt')

function publishEvent(msg) {
  if (process.env.NODE_ENV === 'production') {
    mqtt.
      connect('mqtt://localhost:1883', {clientId: `gui:${MACHINEID}`}).
      publish(`hiome/1/gui:${MACHINEID}/event`, msg).
      end()
  }
}

module.exports = publishEvent
