const db = require('../lib/db')

const cleanTable = async () => {
  const { Items } = await db.dangerousScanAll()
  Items.forEach(item => {
    db.deleteByKey({ userId: item.userId, videoStreamId: item.videoStreamId })
  })
}

beforeEach(async () => {
  await cleanTable()
})
