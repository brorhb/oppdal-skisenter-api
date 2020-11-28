const jwt = require('jsonwebtoken')

module.exports = function authMiddleware(req, res, next) {
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