const Sentry = require('@sentry/node')
Sentry.init()

const express = require('express')
const app = express()

app.use(express.json())

if (process.env.NODE_ENV !== 'production') {
  app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
  })
}

const index = require('./api/routes')
app.use('/api', index)

// serve static files from public (built by gatsby)
app.use(express.static('public'))

app.use(function (req, res, next) {
  res.status(404).send('Sorry cant find that!')
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
