const {
  DYNAMODB_TABLE_NAME,
  DYNAMODB_ENDPOINT,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_DEFAULT_REGION,
  IS_OFFLINE,
  NODE_ENV,
} = process.env

const config = {
  DYNAMODB_TABLE_NAME,
  DYNAMODB_ENDPOINT,
  IS_OFFLINE,
  NODE_ENV,
  AWS_REGION: AWS_DEFAULT_REGION,
  AWS_ACCESS_KEY: AWS_ACCESS_KEY_ID,
  AWS_SECRET_KEY: AWS_SECRET_ACCESS_KEY,
}

module.exports = { config }
