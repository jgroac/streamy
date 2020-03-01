const Joi = require('@hapi/joi')
const { HTTP_STATUS } = require('../config/constants')
const videoStreamService = require('../services/videoStreamService')

const videoStreamRequestSchema = Joi.object({
  userId: Joi.string()
    .max(36)
    .required(),
  videoStreamId: Joi.string()
    .max(36)
    .required(),
})

/**
 *
 * @param {import('express').Request} req Request
 * @param {import('express').Response} res Response
 */
const subscribeToVideoStream = async (req, res, next) => {
  try {
    const sanitizedBody = await videoStreamRequestSchema.validateAsync(req.body)
    const data = await videoStreamService.subscribeToVideoStream(sanitizedBody)
    res.status(HTTP_STATUS.OK).json({
      status: HTTP_STATUS.OK,
      data,
    })
  } catch (error) {
    next(error)
  } finally {
    next()
  }
}

/**
 *
 * @param {import('express').Request} req Request
 * @param {import('express').Response} res Response
 */
const unsubscribeFromVideoStream = async (req, res, next) => {
  try {
    const sanitizedBody = await videoStreamRequestSchema.validateAsync(req.body)
    await videoStreamService.unsubscribeFromVideoStream(sanitizedBody)
    res.status(HTTP_STATUS.NO_CONTENT).json()
  } catch (error) {
    next(error)
  } finally {
    next()
  }
}

module.exports = { subscribeToVideoStream, unsubscribeFromVideoStream }
