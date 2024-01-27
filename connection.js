const mysql = require('mysql');

const config = {
  host: process.env.DB_HOST,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
}

var cluster = mysql.createPoolCluster()
cluster.add(config)
/*
cluster.on('remove', (nodeId) => {
  console.log(`Node ${nodeId} has been removed from the cluster.`);
});

cluster.on('error', (err) => {
  console.error('MySQL Pool Cluster encountered an error:', err);
});

function handleDisconnect() {
  cluster.getConnection((err, connection) => {
    if(err) {
      console.error('Error when connecting to db:', err);
      setTimeout(handleDisconnect, 2000);
    } else if(connection) {
      connection.release();
    }
  });
}

handleDisconnect();
*/
module.exports = connection = cluster.of('*')