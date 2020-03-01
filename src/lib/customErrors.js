const { HTTP_STATUS } = require('../config/constants')

class TooManyVideoStreamsError extends Error {
  /**
   * Create TooManyVideoStreamsError
   * @param {String} message
   */
  constructor() {
    super("You've reached the maximum number of concurrent video streams")
    this.name = this.constructor.name
    this.status = HTTP_STATUS.TOO_MANY_REQUEST
    Error.captureStackTrace(this, this.constructor)
  }
}

module.exports = {
  TooManyVideoStreamsError,
}
