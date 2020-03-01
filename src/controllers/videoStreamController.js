const { HTTP_STATUS } = require('../config/constants')
const videoStreamService = require('../services/videoStreamService')

/**
 *
 * @param {import('express').Request} req Request
 * @param {import('express').Response} res Response
 */
const subscribeToVideoStream = async (req, res, next) => {
  const { userId, videoStreamId } = req.body
  try {
    const data = await videoStreamService.subscribeToVideoStream({ userId, videoStreamId })
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

module.exports = { subscribeToVideoStream }
