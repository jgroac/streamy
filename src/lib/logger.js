const pino = require('pino')
const { config } = require('../config')

const isOnline = !config.IS_OFFLINE

const logger = pino({
  enabled: isOnline,
})

module.exports = { logger }
