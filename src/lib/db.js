const AWS = require('aws-sdk')
const { config } = require('../config')
const { logger } = require('../lib/logger')

const { IS_OFFLINE, DYNAMODB_TABLE_NAME, DYNAMODB_ENDPOINT, AWS_REGION, AWS_ACCESS_KEY, AWS_SECRET_KEY } = config

let dynamoDBOptions = {
  region: AWS_REGION,
}

// Connect to local dynamo whe is offline (running in local)
if (IS_OFFLINE) {
  AWS.config.update({
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY,
  })

  dynamoDBOptions = {
    ...dynamoDBOptions,
    endpoint: DYNAMODB_ENDPOINT,
  }
}

const dynamoDb = new AWS.DynamoDB.DocumentClient(dynamoDBOptions)

async function put(item) {
  const putParams = {
    TableName: DYNAMODB_TABLE_NAME,
    Item: item,
    ReturnConsumedCapacity: 'TOTAL',
    ReturnItemCollectionMetrics: 'SIZE',
  }

  logger.info('put data: ', putParams)

  return dynamoDb.put(putParams).promise()
}

async function getByPartitionKey({ partitionKeyName, value }) {
  const getByPartitionKeyParams = {
    TableName: DYNAMODB_TABLE_NAME,
    ExpressionAttributeValues: {
      ':value': value,
    },
    KeyConditionExpression: `${partitionKeyName} = :value`,
  }

  logger.info('get by partition key: ', getByPartitionKeyParams)

  return dynamoDb.query(getByPartitionKeyParams).promise()
}

async function deleteByKey(key) {
  const deleteParams = {
    TableName: DYNAMODB_TABLE_NAME,
    Key: key,
  }

  logger.info('delete by Key', deleteParams)

  return dynamoDb.delete(deleteParams).promise()
}

async function dangerousScanAll() {
  const scanParams = {
    TableName: DYNAMODB_TABLE_NAME,
  }

  logger.info('please do not use this function is only for testing cleansing')

  return dynamoDb.scan(scanParams).promise()
}

module.exports = {
  put,
  deleteByKey,
  getByPartitionKey,
  dangerousScanAll,
}
