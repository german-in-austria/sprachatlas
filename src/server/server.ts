const express = require('express')
const compression = require('compression')
const path = require('path')

const DEFAULT_PORT = 3333

const app = express()


if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({
    path: './env-dev.env'
  })
}

// This app runs behind an
// application load balancer
// which handles the Certificate
// Negotiation for us, so we must
// trust them if they say it’s https.
app.enable('trust proxy')

// redirect to https if it’s a
// http call.
app.use((request: any, response: any, next: any) => {
  const host = request.headers.host
  const protocol = request.protocol
  if (process.env.NODE_ENV === 'production' && protocol === 'http') {
    response.redirect(301, 'https://' + host + request.url)
  } else {
    next()
  }
})

app.use(compression())

app.use('/', express.static(path.join(__dirname, '../../dist')))

app.listen(process.env.NODE_PORT || DEFAULT_PORT, () => {
  console.log(`Started server on port ${process.env.NODE_PORT || DEFAULT_PORT}`)
})
