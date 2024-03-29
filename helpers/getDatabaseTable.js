var cache = {}

// 5 minutes in milliseconds
var cacheTime = 5 * 60 * 1000

module.exports = getDataFromTable = async (tableName, updateCache = false) => {
  if (cache[tableName] && Date.now() - cache[tableName]["date"] < cacheTime && updateCache === false) {
    return cache[tableName].data
  } else {
    const data = await new Promise((resolve, reject) => {
      connection.query(`SELECT * FROM ${tableName} WHERE is_deleted = 0;`, (err, result) => {
        if (err) {
          console.log(err)
          reject(err)
        }
        resolve(result)
      })
    })
    cache[tableName] = {
      data: data,
      date: Date.now()
    }
    return data
  }
}