const connection = require("../../connection")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const getDataFromTable = (tableName) => {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM ${tableName};`,(err, result) => {
      if (err) reject(err)
      resolve(result)
    })
  })
}

const createHash = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, function(err, hash) {
      if (err) reject(err)
      resolve(hash)
    });
  })
}
const compareHash = (plainText, hash) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(plainText, hash, function(err, result) {
      if (err) reject(false)
      resolve(result)
  });
  })
}

module.exports = function (fastify, opts, done) {
  

  /*fastify.post("/create", async (req, res) => {
    const hash = await new Promise((resolve, reject) => {
      bcrypt.hash(req.body.password, 10, function(err, hash) {
        if (err) reject(err)
        resolve(hash)
      });
    })
    return hash
  })*/

  fastify.post("/login", async (req, res) => {
    const password = req.body.password
    const username = req.body.username
    const users = await getDataFromTable("users")
    const user = users.find((item) => item.username === username && compareHash(password, item.password))
    let refreshToken = jwt.sign({
      exp: Math.floor(Date.now() / 1000) + parseInt(process.env.REFRESH_TOKEN_LIFE),
      data: JSON.stringify({
        "id": user.id,
        "username": user.username,
        "role": user.role
      })
    }, process.env.REFRESH_TOKEN_SECRET)
    return {
      "user": {
        "username": user.username,
        "role": user.role
      },
      "token": refreshToken
    }
  })

  fastify.get("/test-auth", {preValidation: authMiddleware}, (req, res) => {
    return "Hello world"
  })

  done()
}

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1]
  try {
    let decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
    decoded = JSON.parse(decoded.data)
    if (decoded.role === 1) {
      next()
    } else {
      throw "User dont have access to this route"
    }
  } catch(err) {
    res.code(403)
    res.send({"error": err})
  }
}