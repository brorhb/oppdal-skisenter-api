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
              name = ?,
              status = ?,
              start_position = ?,
              end_position = ?,
              elevation = ?,
              length = ?,
              type = ?,
              map_name = ?,
              zone = ?
            WHERE id = ?
            `,
            [lift.name, lift.status, lift.start_position, lift.end_position, lift.elevation, lift["length"], lift.type, lift.map_name, lift.zone, liftId],
            (error, result, fields) => {
              if (error) reject(error)
              resolve(result)
            }
          )
        })
        if (lift.coords) {
          await new Promise(async (resolve, reject) => {
            const coords = await getDataFromTable("lift_coord_in_map")
            if (coords.find((item) => item.lift == liftId)) {
              connection.query(`
                UPDATE
                  lift_coord_in_map
                SET
                  coord = '${lift.coords}'
                WHERE lift = '${liftId}';
                `, (error, result) => {
                  if (error) reject(error)
                  resolve(result)
                }
              )
            } else {
              connection.query(`
                INSERT INTO
                  lift_coord_in_map (coord, lift)
                VALUES (
                  ${lift.coords},
                  ${lift.id}
                )
              `), (error, result) => {
                if (error) reject(error)
                resolve(result)
              }
            }
          })
        }

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
        const newId = lifts.length > 0 ? lifts[lifts.length-1].id + 1 : 1
        await new Promise((resolve, reject) => {
          connection.query(`
          INSERT INTO
            lifts (id, name, status, start_position, end_position, elevation, length, type, map_name, zone)
          VALUES (
            '${newId}',
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
        const liftId = pathParams[pathParams.length - 1]
        await new Promise((resolve, reject) => {
          connection.query("DELETE FROM lift_coord_in_map WHERE lift = ?", [liftId], (err, res) => {
            if (err) reject(err)
            resolve(res)
          })
        })
        const result = await new Promise((resolve, reject) => {
          connection.query("DELETE FROM lifts WHERE id = ?", [liftId], (err, res) => {
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