require('dotenv').config()
const fastify = require('fastify')({ logger: true })
require("./connection")

// Run the server!
const start = async () => {
  try {
    fastify.register(require('fastify-cors'))
    fastify.register(require('./routes/v1'), { prefix: '/v1' })
    // TODO: ADD '0.0.0.0'
    await fastify.listen(process.env.PORT || 3000)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()