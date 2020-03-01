const express = require('express')
const bodyParser = require('body-parser')
const { HTTP_STATUS } = require('./config/constants')
const { errorHandler } = require('./lib/errorHandler')
const { videoStreamController } = require('./controllers')

const app = express()

app.use(bodyParser.json({ strict: false }))

app.get('/health', (_, res) => res.status(HTTP_STATUS.OK).json({ status: 'OK' }))
app.post('/video-streams/subscription', videoStreamController.subscribeToVideoStream)
app.delete('/video-streams/subscription', videoStreamController.unsubscribeFromVideoStream)

app.use(errorHandler)

module.exports = app
