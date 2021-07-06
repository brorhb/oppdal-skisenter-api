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
        const camera = req.body
        await new Promise((resolve, reject) => {
          connection.query(`
          UPDATE
            camera
          SET
            name = ?,
            url = ?,
            zone = ?
          WHERE id = ?;
          `, [camera.name, camera.url, camera.zone, req.params.id], (error, result) => {
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
    method: "DELETE",
    preValidation: authMiddleware,
    url: "/:id",
    handler: async (req, res) => {
      try {
        await new Promise((resolve, reject) => {
          connection.query('DELETE FROM camera WHERE id = ?', [req.params.id], (error, result) => {
            if (error) reject(error);
            resolve(result)
          })
        })
        return {
          "success": true
        }
      } catch (error) {
        res.code = 500
        return {
          "success": false,
          "message": error
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
        const camera = req.body
        await new Promise((resolve, reject) => {
          connection.query(`
          INSERT INTO
            camera (name, url, zone)
          VALUES (?, ?, ?);
          `, [camera.name, camera.url, camera.zone], (error, result) => {
            if (error) reject(error)
            resolve(result)
          })
        })
        return {
          "success": true
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