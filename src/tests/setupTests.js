const db = require('../lib/db')

const cleanTable = async () => {
  const { Items } = await db.dangerousScanAll()
  const deleteItems = Items.map(item => db.deleteByKey({ userId: item.userId, videoStreamId: item.videoStreamId }))
  await Promise.all(deleteItems)
}

beforeEach(async () => {
  await cleanTable()
})
