require('dotenv').config()
const fastify = require('fastify')({ logger: true })
require("./connection")


fastify.register(require('fastify-cors'))
fastify.register(require('./routes/v1'), { prefix: '/v1' })

// Run the server!
const start = async () => {
  try {
    await fastify.listen(process.env.PORT || 3000, '0.0.0.0')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()