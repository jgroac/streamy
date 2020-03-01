const db = require('../lib/db')
const { TooManyVideoStreamsError } = require('../lib/customErrors')
const { config } = require('../config')

/**
 *
 * @param {String} userId user UUID
 * @param {String} videoStreamId UUID
 */
const subscribeToVideoStream = async ({ userId, videoStreamId }) => {
  const userVideoStreamSubscriptions = await db.getByPartitionKey({ partitionKeyName: 'userId', value: userId })

  if (userVideoStreamSubscriptions.Count >= config.MAX_CONCURRENT_STREAMS) {
    throw new TooManyVideoStreamsError()
  }

  await db.put({
    userId,
    videoStreamId,
  })

  return { userId, videoStreamId }
}

module.exports = { subscribeToVideoStream }
