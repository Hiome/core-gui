const MACHINEID = process.env.NODE_ENV === 'production' ? require('fs').readFileSync('/sys/class/net/eth0/address', 'utf8').trim() : 'local'
const mqtt = require('mqtt')

function publishEvent(msg) {
  if (process.env.NODE_ENV === 'production') {
    const client = mqtt.connect('mqtt://localhost:1883', {clientId: `gui:${MACHINEID}`})
    client.on('connect', () => client.publish(`hiome/1/gui:${MACHINEID}/event`, msg, () => client.end()))
  }
}

module.exports = publishEvent
