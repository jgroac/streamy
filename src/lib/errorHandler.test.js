const cases = require('jest-in-case')
const Joi = require('@hapi/joi')
const { HTTP_STATUS } = require('../config/constants')
const { TooManyVideoStreamsError } = require('./customErrors')
const { errorHandler } = require('./errorHandler')

beforeEach(() => {
  jest.clearAllMocks()
})

describe('errorHandler', () => {
  describe('when a error is thrown', () => {
    cases(
      'should handle correctly',
      async testCase => {
        const jsonMock = jest.fn()
        const next = jest.fn()
        const req = null
        const res = {
          status: jest.fn().mockImplementation(status => {
            expect(status).toBe(testCase.expectedStatusCode)
            return { json: jsonMock }
          }),
        }
        errorHandler(testCase.error, req, res, next)
      },
      {
        TooManyVideoStreamsError: {
          expectedStatusCode: HTTP_STATUS.TOO_MANY_REQUEST,
          error: new TooManyVideoStreamsError(),
        },
        InputValidationError: {
          expectedStatusCode: HTTP_STATUS.BAD_REQUEST,
          error: new Joi.ValidationError(),
        },
        InternalServerError: {
          expectedStatusCode: HTTP_STATUS.INTERNAL_SERVER_ERROR,
          error: new Error('Unknown error'),
        },
      }
    )
  })

  describe('when error is not defined', () => {
    it('should call next middleware', () => {
      const next = jest.fn()
      const req = null
      const res = null
      errorHandler(null, req, res, next)

      expect(next).toHaveBeenCalled()
    })
  })
})
