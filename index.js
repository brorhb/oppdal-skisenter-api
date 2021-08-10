require('dotenv').config()
const fastify = require('fastify')({ logger: true })
require("./connection")

// Run the server!
const start = async () => {
  try {
    fastify.register(require('fastify-cors'))
    fastify.register(require('./routes/v1'), { prefix: '/v1' })
    
    await fastify.listen(process.env.PORT || 5001, process.env.ENVIRONMENT === "development" ? '127.0.0.1' : '0.0.0.0')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()