const connection = require("../../connection")

module.exports = function (fastify, opts, done) {
  fastify.get("/hello", async () => {
    return "hello world"
  })
  done()
}