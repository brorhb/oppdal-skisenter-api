module.exports = setAllSnowconditionsFalse = () => {
    return new Promise((resolve, reject) => {
      connection.query(`UPDATE snow_conditions SET is_live = 0;`,(err, result) => {
        if (err) {
          console.log(err)
          reject(err)
        }
        resolve(result)
      })
    })
  }