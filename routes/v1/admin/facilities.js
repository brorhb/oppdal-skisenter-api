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
        const facilityId = pathParams[pathParams.length - 1]
        const facility = req.body
        await new Promise((resolve, reject) => {
          connection.query(`
          UPDATE
            facilities
          SET
            name = '${facility.name}',
            type = '${facility.type}',
            status = '${facility.status}',
            zone = '${facility.zone}'
          WHERE id = '${facilityId}';
          `, (error, result) => {
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
        const facilities = await getDataFromTable("facilities")
        const facility = req.body
        const newId = facilities.length > 0 ? facilities[facilities.length-1].id + 1 : 1
        await new Promise((resolve, reject) => {
          connection.query(`
          INSERT INTO
            facilities (id, name, type, status, zone)
          VALUES (
            '${newId}',
            '${facility.name}',
            '${facility.type}',
            ${facility.status},
            ${facility.zone}
          );
          `, (error, result) => {
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
        const facilityId = pathParams[pathParams.length - 1]
        const result = await new Promise((resolve, reject) => {
          connection.query(`DELETE FROM facilities WHERE id = ${facilityId}`, (err, res) => {
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