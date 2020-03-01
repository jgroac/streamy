const Joi = require('@hapi/joi')
const { TooManyVideoStreamsError, InputValidationError } = require('./customErrors')

/**
 * Middleware to handle errors
 * @param {import('express').Errback} error error
 * @param {import('express').Request} req Request
 * @param {import('express').Response} res Response
 * @param {import('express').NextFunction} next next function
 */
const errorHandler = (error, req, res, next) => {
  if (error instanceof TooManyVideoStreamsError) {
    res.status(error.status).json({
      status: error.status,
      error: error.message,
    })
  }

  if (error instanceof Joi.ValidationError) {
    const inputValidationError = new InputValidationError(error)
    res.status(inputValidationError.status).json({
      status: inputValidationError.status,
      error: inputValidationError.message,
    })
  }

  return next()
}

module.exports = {
  errorHandler,
}
