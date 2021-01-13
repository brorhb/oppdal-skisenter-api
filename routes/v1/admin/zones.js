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
        const zoneId = pathParams[pathParams.length - 1]
        const zone = req.body
        await new Promise((resolve, reject) => {
          connection.query(`
          UPDATE
            zone
          SET
            name = ?
          WHERE id = ?;
          `, [zone.name, zoneId], (error, result) => {
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
        const zones = await getDataFromTable("zone")
        const zone = req.body
        const newId = zones.length > 0 ? zones[zones.length-1].id + 1 : 1
        await new Promise((resolve, reject) => {
          connection.query(`
          INSERT INTO
            zone (id, name)
          VALUES (?, ?);
          `, [newId, zone.name], (error, result) => {
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

  fastify.route({
    method: "DELETE",
    preValidation: authMiddleware,
    url: "/:id",
    handler: async (req, res) => {
      try {
        const pathParams = req.url.split("/")
        const zoneId = pathParams[pathParams.length - 1]
        const result = await new Promise((resolve, reject) => {
          connection.query(`DELETE FROM zone WHERE id = ?`, [zoneId], (err, res) => {
            if (err) reject(err)
            resolve(res)
          })
        })
        return {
          "success": true,
          "message": result
        }
      }
      catch(err) {
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