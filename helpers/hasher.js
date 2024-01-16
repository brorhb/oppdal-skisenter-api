const bcrypt = require('bcryptjs')

const createHash = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, function (err, hash) {
      if (err) reject(err)
      resolve(hash)
    });
  })
}

const compareHash = (plainText, hash) => {
  return new Promise((resolve, reject) => {
    bcrypt.compare(plainText, hash, function (err, result) {
      if (err) reject(false)
      resolve(result)
    });
  })
}

module.exports = {
  createHash,
  compareHash
}