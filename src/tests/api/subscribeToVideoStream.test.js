const request = require('supertest')
const app = require('../../app')
const { HTTP_STATUS } = require('../../config/constants')
const db = require('../../lib/db')

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

    describe('when the user is subscribed to the maximum number of concurrent video streams', () => {
      fit('should return error with to many request status code', async () => {
        const userId = '123'
        await db.put({ userId, videoStreamId: '1' })
        await db.put({ userId, videoStreamId: '2' })
        await db.put({ userId, videoStreamId: '3' })

        const response = await request(app)
          .post('/video-streams/subscription')
          .send({ userId, videoStreamId: '4' })
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(HTTP_STATUS.TOO_MANY_REQUEST)

        expect(response.body).toEqual({
          status: HTTP_STATUS.TOO_MANY_REQUEST,
          error: "You've reached the maximum number of concurrent video streams",
        })
      })
    })
  })
})
