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

  describe('when getByPartitionKey is called with an userId', () => {
    it('should return the items with the same partitionKey', async () => {
      const userId = '122'
      await db.put({ userId: 'unknownUserId', videoStreamId: '2' })
      await db.put({ userId, videoStreamId: '1' })
      await db.put({ userId, videoStreamId: '2' })

      const response = await db.getByPartitionKey({ partitionKeyName: 'userId', value: userId })

      expect(response).toEqual({
        Items: [
          { userId, videoStreamId: '1' },
          { userId, videoStreamId: '2' },
        ],
        Count: 2,
        ScannedCount: 2,
      })
    })
  })

  describe('when deleteByKey is called with a valid key', () => {
    it('should delete the record from the table', async () => {
      await db.put({ userId: '33', videoStreamId: '3' })

      const response = await db.deleteByKey({ userId: '33', videoStreamId: '3' })

      expect(response).toEqual({})
    })
  })

  describe('when dangerousScanAll is called', () => {
    it('should return all table items', async () => {
      await db.put({ userId: '33', videoStreamId: '3' })
      await db.put({ userId: '44', videoStreamId: '2' })

      const response = await db.dangerousScanAll({ userId: '33', videoStreamId: '3' })

      expect(response.Count).toBe(2)
    })
  })
})
