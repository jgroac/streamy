const db = require('../lib/db')

/**
 *
 * @param {String} userId user UUID
 * @param {String} videoStreamId UUID
 */
const subscribeToVideoStream = async ({ userId, videoStreamId }) => {
  await db.put({
    userId,
    videoStreamId,
  })

  return { userId, videoStreamId }
}

module.exports = { subscribeToVideoStream }
