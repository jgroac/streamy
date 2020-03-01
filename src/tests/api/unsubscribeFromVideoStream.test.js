const request = require('supertest')
const cases = require('jest-in-case')
const app = require('../../app')
const { HTTP_STATUS } = require('../../config/constants')
const db = require('../../lib/db')

describe('unsubscribeFromVideoStream', () => {
  describe('user attempts to unsubscribe to a video stream with valid payload', () => {
    describe('when the subscription exists', () => {
      it('should unsubscribe the user from video stream', async () => {
        const userId = '123'
        const videoStreamId = '3'
        await db.put({ userId, videoStreamId: '1' })
        await db.put({ userId, videoStreamId })

        await request(app)
          .delete('/video-streams/subscription')
          .send({ userId, videoStreamId })
          .set('Accept', 'application/json')
          .expect(HTTP_STATUS.NO_CONTENT)

        const userVideoStreamSubscriptions = await db.getByPartitionKey({ partitionKeyName: 'userId', value: userId })
        expect(userVideoStreamSubscriptions.Count).toBe(1)
        expect(userVideoStreamSubscriptions.Items[0]).toEqual({
          userId,
          videoStreamId: '1',
        })
      })
    })

    describe("when the subscription doesn't exists", () => {
      it('should return no content', async () => {
        await request(app)
          .delete('/video-streams/subscription')
          .send({ userId: '22', videoStreamId: '4' })
          .set('Accept', 'application/json')
          .expect(HTTP_STATUS.NO_CONTENT)
      })
    })
  })

  describe('user attempts to unsubscribe to a video stream with invalid payload', () => {
    cases(
      'should return error when userId',
      async testCase => {
        const response = await request(app)
          .post('/video-streams/subscription')
          .send(testCase.body)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(HTTP_STATUS.BAD_REQUEST)

        expect(response.body).toEqual({
          status: HTTP_STATUS.BAD_REQUEST,
          error: testCase.expectedErrorMessage,
        })
      },
      {
        'is not present': {
          body: { videoStreamId: '4' },
          expectedErrorMessage: '"userId" is required',
        },
        'is not a string': {
          body: { userId: {}, videoStreamId: '4' },
          expectedErrorMessage: '"userId" must be a string',
        },
      }
    )

    cases(
      'should return error when videoStreamId',
      async testCase => {
        const response = await request(app)
          .post('/video-streams/subscription')
          .send(testCase.body)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(HTTP_STATUS.BAD_REQUEST)

        expect(response.body).toEqual({
          status: HTTP_STATUS.BAD_REQUEST,
          error: testCase.expectedErrorMessage,
        })
      },
      {
        'is not present': {
          body: { userId: '4' },
          expectedErrorMessage: '"videoStreamId" is required',
        },
        'is not a string': {
          body: { userId: '4', videoStreamId: {} },
          expectedErrorMessage: '"videoStreamId" must be a string',
        },
      }
    )
  })
})
