const mysql = require('mysql');

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
}

module.exports = function handleDisconnect() {
  connection = mysql.createConnection(config)

  connection.connect(function(err) {
    if (err) {
      console.log('error when connecting to db:', err)
      setTimeout(handleDisconnect, 2000)
    }
  })
  connection.on('error', function(err) {
    console.log('db error', err)
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect()
    } else {
      throw err
    }
  });
}

module.exports = mysql.createConnection(config)