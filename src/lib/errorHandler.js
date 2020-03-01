const Joi = require('@hapi/joi')
const { logger } = require('../lib/logger')
const { TooManyVideoStreamsError, InputValidationError, InternalServerError } = require('./customErrors')

/**
 * Middleware to handle errors
 * @param {import('express').Errback} error error
 * @param {import('express').Request} req Request
 * @param {import('express').Response} res Response
 * @param {import('express').NextFunction} next next function
 */
const errorHandler = (error, req, res, next) => {
  if (error instanceof TooManyVideoStreamsError) {
    logger.info('Too many concurrent video streams', { error })
    return res.status(error.status).json({
      status: error.status,
      error: error.message,
    })
  }

  if (error instanceof Joi.ValidationError) {
    logger.info('Invalid values', { error })
    const inputValidationError = new InputValidationError(error)
    return res.status(inputValidationError.status).json({
      status: inputValidationError.status,
      error: inputValidationError.message,
    })
  }

  if (error) {
    logger.error(error)
    const internalError = new InternalServerError(error)
    return res.status(internalError.status).json({
      status: internalError.status,
      error: internalError.message,
    })
  }

  return next()
}

module.exports = {
  errorHandler,
}
