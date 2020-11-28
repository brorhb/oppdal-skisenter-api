module.exports = getDataFromTable = (tableName) => {
  return new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM ${tableName};`,(err, result) => {
      if (err) reject(err)
      resolve(result)
    })
  })
}