const Sentry = require('@sentry/node')
Sentry.init()

const compression = require('compression')
const express = require('express')
const app = express()

app.use(express.json())
app.use(compression())

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, HEAD')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

const index = require('./api/1/routes')
app.use('/api/1', index)

// serve static files from public (built by gatsby)
app.use(express.static('public'))

app.use(function (req, res, next) {
  if (req.path.startsWith('/api/'))
    res.status(404).send('Not found')
  else
    res.status(404).sendFile(`${__dirname}/public/404.html`)
})

app.use(function (err, req, res, next) {
  Sentry.captureException(err)
  console.error(err.stack)
  if (res.headersSent) {
    return next(err)
  }
  res.status(500).send('Something broke!')
})

app.listen(3000, function(){
  console.log('Hiome listening on port 3000')
})
