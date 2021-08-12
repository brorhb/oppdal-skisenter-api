module.exports = getSnowconditions = () => {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT * FROM snow_conditions WHERE is_live = 1 ORDER BY timestamp DESC;`,(err, result) => {
        if (err) {
          console.log(err)
          reject(err)
        }
        resolve(result)
      })
    })
  }