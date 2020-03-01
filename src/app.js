const express = require('express')
const bodyParser = require('body-parser')
const { HTTP_STATUS } = require('./config/constants')

const app = express()

app.use(bodyParser.json({ strict: false }))

app.get('/health', (_, res) => res.status(HTTP_STATUS.OK).json({ status: 'OK' }))

module.exports = app
