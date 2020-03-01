const db = require('./db')
const { config } = require('../config')

const { DYNAMODB_TABLE_NAME } = config

describe('Dynamo db', () => {
  describe('when put is called with an item', () => {
    it('creates the record in the right table', async () => {
      const item = { userId: '122', videoStreamId: '1' }

      const response = await db.put(item)

      expect(response).toEqual({
        ConsumedCapacity: {
          CapacityUnits: 1,
          TableName: DYNAMODB_TABLE_NAME,
        },
      })
    })
  })
})
