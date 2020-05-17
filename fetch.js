const http = require('http')
const https = require('https')

// adapted from https://stackoverflow.com/questions/51070032/fetch-and-post-text-in-nodejs
function fetch(url, options = {}) {
  return new Promise((resolve, reject) => {
    if (!url) return reject(new Error('Url is required'))

    const { body, method = 'GET', ...restOptions } = options
    const request = (url.startsWith('https') ? https : http).request(url, { method, ...restOptions }, (res) => {
      res.setEncoding('utf8')

      let chunks = ''
      res.on('data', (chunk) => {
        chunks += chunk
      })

      res.on('end', () => {
        resolve({ statusCode: res.statusCode, body: chunks })
      })
    })

    request.on('error', reject)

    if (body) {
      request.setHeader('Content-Length', body.length)
      request.write(body)
    }

    request.end()
  })
}

module.exports = fetch