const AWS = require('aws-sdk')
const { config } = require('../config')

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

  console.log('put data: ', putParams)

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

  console.log('get by partition key: ', getByPartitionKeyParams)

  return dynamoDb.query(getByPartitionKeyParams).promise()
}

async function deleteByKey(key) {
  const deleteParams = {
    TableName: DYNAMODB_TABLE_NAME,
    Key: key,
  }

  console.log('delete by Key', deleteParams)

  return dynamoDb.delete(deleteParams).promise()
}

async function dangerousScanAll() {
  const scanParams = {
    TableName: DYNAMODB_TABLE_NAME,
  }

  console.log('please do not use this function is only for testing cleansing')

  return dynamoDb.scan(scanParams).promise()
}

module.exports = {
  put,
  deleteByKey,
  getByPartitionKey,
  dangerousScanAll,
}
