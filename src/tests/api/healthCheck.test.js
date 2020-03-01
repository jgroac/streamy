const request = require('supertest')
const app = require('../../app')

describe('healthCheck', () => {
  describe('when service is healthy', () => {
    it('should return OK', async () => {
      const response = await request(app)
        .get('/health')
        .set('Accept', 'application/json')
        .expect(200)

      expect(response.body).toEqual({
        status: 'OK',
      })
    })
  })
})
