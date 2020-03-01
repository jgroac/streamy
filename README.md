#Streamy

An API to check how many video streams a user is watching concurrently, built using serverless architecture.

## Requirements

This API depends on Dynamodb for persistent storage of video stream request. It also requires Docker to build run locally and serverless for deployments.

1. [Docker](https://docs.docker.com/install/)
2. [serverless framework](https://serverless.com/framework/docs/getting-started/)

## Quickstart

To build and run locally, perform the following steps:

```bash
$ git clone <repo>
$ cd ./<repo>
$ docker-compose up --build
```

Or using serverless framework offline:

```bash
$ git clone <repo>
$ cd ./<repo>
$ npm install
$ sls dynamodb install
$ npm run serverless:local
```

By default the the API will be available on <http://localhost:3000>.

## Running the tests

`jest` and `supertest` are used for testing:

#### Running with docker

```bash
$ docker-compose up -d
$ docker exec -it streamy npm run test
```

#### Running in the host system:

```bash
$ docker-compose up -d # required for local dynamo
$ npm install
$ npm run test:local
```

#### Deploying

Prerequisite:

- [serverless framework](https://serverless.com/framework/docs/getting-started/)

```bash
$ npm install
$ npm run serverless:deploy
```

## Assumptions

It's assumed that when a user request video stream to watch, the request will provided an `userId` (UUID) and `videoStreamId` (UUID) to identify the user as well as the video. Streamy API will then check if the user is watching the maximum number of concurrent streams. If not the API will response with HTTP status code of 200 and the `userId` and `videoStreamId` informing that was processed successfully.

Otherwise if the user is already watching(subscribe) to the maximum number of concurrent video streams (3 by default), the API will response with a status code 429 and error message saying `You've reached the maximum number of concurrent video streams`.

When the user wants to stops watching or unsubscribe to a video stream, the user will provided an `userId` and `videoStreamId`. This will remove the record from the database.

It's assumed that there will be multiple services calling this API to check the user video stream subscriptions, and those services will hold the data related to the `userId` and `videoStreamId`.

View the `api.yml` file for more information.

## How it works

The API exposed the following endpoints:

- **/video-streams/subscription**: To subscribe or unsubscribe from video stream.

  - POST
  - DELETE

- **/health**: To check that the API is up.
  - GET

To subscribe to a new video stream send `POST` request to:
`/video-streams/subscription` with a json payload:

```json
{
  "userId": "user-uuid-1",
  "videoStreamId": "video-uuid-1"
}
```

**DELETE**:
To stop a video stream subscription sed `DELETE` request to:
`/video-streams/subscription` with a json payload:

```json
{
  "userId": "user-uuid-1",
  "videoStreamId": "video-uuid-1"
}
```

Sample request to subscribe `/video-streams/subscription

```bash
curl --location --request POST '<http://localhost:3000/video-streams/subscription>' \\
\--header 'Content-Type: application/json' \\
\--data-raw '{
	"userId": "1",
	"videoStreamId": "2"
}'

```

Sample request to unsubscribe `/video-streams/subscription

```bash

curl --location --request DELETE '<http://localhost:3000/video-streams/subscription>' \\
\--header 'Content-Type: application/json' \\
\--data-raw '{
	"userId": "1",
	"videoStreamId": "2"
}'
```

## Design Considerations

I implemented this using serverless architecture. I anticipate this API would experience extremely high loads during the streaming of really popular video content, but with low to moderate load during not so popular content, so i decided to go for lambda, dynamodb and api gateway to be able to save money during those moments and be able to scale faster when is required.

My only concern really is the Lambda concurrency soft limits per region, this means that by default my application will be only able to run 1000 Lambdas at the same time in a given region. So if we assume we don't have any other lambda in the region we can do some maths to determine how many request this architecture will be able to satisfied.

Assuming our Lambda execution time average is 150ms, this means 1 Lambda will be able to satisfied:

1 Lambda function can process 6.66 request in one second, if then we multiply this by the number of lambda that we can run concurrently this give us:

- 6600 request/second

As you can see those numbers are not impressive, but given this is an amazon soft limit you can increase as long as you can backup that you will have higher peaks. For example let's said that they decided to increase the soft limit for you aws to 10000 concurrent lambdas. Now the API would be able to handle.

- 66000 request/second

In addition to that you can optimized your lambda to take less than 150ms, allowing the API to handle a much bigger number of request per second. Also it's worth to mention often-slow response time for lambda functions that are infrequently used, in that case my suggestion would be to ping your lambda function every 5-15 minutes to keep it warn.

I am using expressjs as framework because provide a nice interface/abstraction on top of lambda, allowing me to do things quickly and having support of multiple packages out of the box, in addition other biggest advantage is that it makes the onboard of new engineer more easier to a new codebase, i'd lying if i said that AWS docs are simple.

I used Dynamodb in order to avoid having to worry about sharing state within the app. Also it comes with the amazing advantage of global tables, eliminating the difficult work of replicate data between regions.

I decided to go for pino as the logging library because is faster, and the first thing that you want in a lambda is to process everything within milliseconds, i'm using the default configuration that i know won't give me the best results, but this can be configure in the future to get better structure logs. Following the lambda architecture we can also improve the system observability using Cloudtrail and XRay.

It's assumed that the API doesn't need authentication or authorization, so it has not being implemented.
