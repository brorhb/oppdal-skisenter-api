require('dotenv').config()
const fastify = require('fastify')({ logger: true })
const v1 = require("./routes/v1")
const connection = require("./connection")



fastify.register(require('./routes/v1'), { prefix: '/v1' })

// Run the server!
const start = async () => {
  try {
    await fastify.listen(process.env.PORT || 3000, '0.0.0.0')
    connection.connect((err) => {
        if (err) console.log(`Could not connect to Database ${err}`)
        console.log("Connected to database")
    })
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

start()