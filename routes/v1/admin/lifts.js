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
        const liftId = pathParams[pathParams.length - 1]
        const lift = req.body
        await new Promise((resolve, reject) => {
          connection.query(`
          UPDATE
            lifts
          SET
            name = '${lift.name}',
            status = '${lift.status}',
            start_position = ${lift.start_position ?? null},
            end_position = ${lift.end_position ?? null},
            elevation = '${lift.elevation}',
            length = '${lift["length"]}',
            type = '${lift.type}',
            map_name = '${lift.map_name}',
            zone = '${lift.zone}'
          WHERE id = '${liftId}';
          `, (error, result) => {
            if (error) reject(error)
            resolve(result)
          })
        })
        await new Promise((resolve, reject) => {
          connection.query(`
          REPLACE INTO
            lift_coord_in_map
          SET
            coord = '${lift.coords}'
          WHERE track = '${liftId}';
          `, (error, result) => {
            if (error) reject(error)
            resolve(result)
          })
        })
        
        await new Promise(async (resolve, reject) => {
          const coords = await getDataFromTable("track_coord_in_map")
          if (coords.find((item) => item.lift == liftId)) {
            connection.query(`
              UPDATE
                lift_coord_in_map
              SET
                coord = '${lift.coords}'
              WHERE track = '${liftId}';
              `, (error, result) => {
                if (error) reject(error)
                resolve(result)
              }
            )
          } else {
            connection.query(`
              INSERT INTO
                track_coord_in_map (coord, lift)
              VALUES (
                ${lift.coords},
                ${lift.id}
              )
            `)
          }
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
        const lifts = await getDataFromTable("lifts")
        const lift = req.body
        await new Promise((resolve, reject) => {
          connection.query(`
          INSERT INTO
            lifts (id, name, status, start_position, end_position, elevation, length, type, map_name, zone)
          VALUES (
            '${lifts[lifts.length-1].id + 1}',
            '${lift.name}',
            '${lift.status}',
            ${lift.start_position ?? null},
            ${lift.end_position ?? null},
            '${lift.elevation}',
            '${lift["length"]}',
            '${lift.type}',
            '${lift.map_name}',
            '${lift.zone}'
          );
          `, (error, result) => {
            if (error) reject(error)
            resolve(result)
          })
        })
        return {
          "success": true,
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
        const liftId = pathParams[pathParams.length - 1]
        const result = await new Promise((resolve, reject) => {
          connection.query(`DELETE FROM lifts WHERE id = ${liftId}`, (err, res) => {
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