const express = require('express')
const bodyParser = require('body-parser')

const app = express()

app.use(bodyParser.json({ strict: false }))

app.get('/health', (_, res) => res.status(200).json({ status: 'OK' }))

module.exports = app
