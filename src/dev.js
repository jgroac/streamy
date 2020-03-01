const app = require('./app')
const { config } = require('./config')

const { DEVELOPMENT_PORT } = config

app.listen(DEVELOPMENT_PORT, () => console.log(`Example app listening on port ${DEVELOPMENT_PORT}!`))
