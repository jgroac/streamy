const request = require('supertest')
const { HTTP_STATUS } = require('../../config/constants')
const app = require('../../app')

describe('healthCheck', () => {
  describe('when service is healthy', () => {
    it('should return OK', async () => {
      const response = await request(app)
        .get('/health')
        .set('Accept', 'application/json')
        .expect(HTTP_STATUS.OK)

      expect(response.body).toEqual({
        status: 'OK',
      })
    })
  })
})
