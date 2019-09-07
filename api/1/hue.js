const fs = require('fs')
const huejay = require('huejay')

const NO_BRIDGES_FOUND = 0
const NO_LINK          = 1
const DATA_PATH = '/data/hue.json'

function search(req, res, next) {
  huejay.discover({strategy: 'all'})
    .then(validateBridges)
    .then(r => {
      if (r === NO_BRIDGES_FOUND) {
        res.send('no_bridges_found')
      } else if (r === NO_LINK) {
        res.send('no_link_pushed')
      } else {
        res.send('connected')
      }
    })
    .catch(error => {
      res.status(500).send(`An error occurred: ${error.message}`)
      next(error)
    })
}

// determine if bridge is actually accessible to us
function validateBridges(bridges) {
  // make sure device is online
  const promises = bridges.map(bridge => {
    return new huejay.Client({host: bridge.ip}).bridge.ping()
      .then(() => bridge.ip)
      .catch(error => null)
  })

  Promise.all(promises).then(pingables => {
    // remove duplicates and nulls
    const bridgesFrd = [...new Set(pingables)].filter(x => x)
    if (bridgesFrd.length == 0) {
      return NO_BRIDGES_FOUND
    } else {
      Promise.all(bridgesFrd.map(bridge => authenticateUser(bridge.ip)))
        .then(authenticatable => {
          const authenticatableFrd = authenticatable.filter(x => x)
          return authenticatableFrd.length == 1 ? authenticatableFrd[0] : NO_LINK
        })
    }
  })
}

function authenticateUser(host) {
  const username = readUsername()
  if (username) {
    // try authenticating with existing username before moving forward
    return new huejay.Client({host, username}).bridge.isAuthenticated()
      .then(() => true)
      .catch(error => createUser(host))
  } else {
    return createUser(host)
  }
}

// returns true if user is created, false if there was an error (link button not pushed)
function createUser(host) {
  const client = new huejay.Client({host})
  let user = new client.users.User
  user.deviceType = 'Hiome'

  return client.users.create(user)
    .then(user => {
      saveUsername(user.username)
      return true
    })
    .catch(error => {
      if (error instanceof huejay.Error && error.type === 101)
        return false
      else
        return Promise.reject(error)
    })
}

// read hue.json
function readUsername() {
  if (fs.existsSync(DATA_PATH)) {
    const dataFile = fs.readFileSync(DATA_PATH)
    return JSON.parse(dataFile).hueUsername
  }
  return null
}

// write hue.json as a new file
function saveUsername(username) {
  fs.writeFile(DATA_PATH, JSON.stringify({username}))
}

module.exports = { search }
