const mysql = require('mysql');

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
}

var cluster = mysql.createPoolCluster()
cluster.add(config)

module.exports = connection = cluster.of('*')