const request = require('supertest')
const app = require('../../app')
const { HTTP_STATUS } = require('../../config/constants')

describe('subscribeToVideoStream', () => {
  describe('user attempts to subscribe to a video stream with valid payload', () => {
    describe('when there is no subscriptions associated to the user', () => {
      it('should subscribe the user to the video stream', async () => {
        const userId = '123'
        const videoStreamId = '234'

        const response = await request(app)
          .post('/video-streams/subscription')
          .send({ userId, videoStreamId })
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(HTTP_STATUS.OK)

        expect(response.body).toEqual({
          status: HTTP_STATUS.OK,
          data: {
            userId,
            videoStreamId,
          },
        })
      })
    })
  })
})
