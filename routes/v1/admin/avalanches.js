const getDataFromTable = require('../../../helpers/getDatabaseTable')
const authMiddleware = require('../../../helpers/authMiddleware')
const connection = require("../../../connection")

module.exports = function (fastify, opts, done) {
  fastify.route({
    method: "PATCH",
    url: "/:id",
    preValidation: authMiddleware,
    handler: async (req, res) => {
      try {
        const pathParams = req.url.split("/")
        const avalancheId = pathParams[pathParams.length - 1]
        const avalanche = req.body
        await new Promise((resolve, reject) => {
          connection.query(`
          UPDATE
            avalanche_log
          SET
            level = ?,
            timestamp = DEFAULT
          WHERE id = ?;
          `, [avalanche.name, avalancheId], (error, result) => {
            if (error) reject(error)
            resolve(result)
          })
        })
        return {
          "success": true
        }
      } catch(err) {
        return {
          "success": false,
          "message": err
        }
      }
    }
  })

  fastify.route({
    method: "POST",
    preValidation: authMiddleware,
    url: "/add",
    handler: async (req, res) => {
      try {
        let avalanches = await getDataFromTable("avalanche_log")
        if (!avalanches) avalanches = []
        const avalanche = req.body
        const newId = avalanches.length > 0 ? avalanches[avalanches.length-1].id + 1 : 1
        await new Promise((resolve, reject) => {
          connection.query(`
          INSERT INTO
            avalanche_log (id, level, timestamp)
          VALUES (?, ?, DEFAULT);
          `, [newId, avalanche.level], (error, result) => {
            if (error) reject(error)
            resolve(result)
          })
        })
        return {
          "success": true,
          "message": {
            "id": newId
          }
        }
      } catch(err) {
        res.code = 500
        return {
          "success": false,
          "message": err
        }
      }
    }
  })

  done()
}