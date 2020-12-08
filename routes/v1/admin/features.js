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
        const featureId = pathParams[pathParams.length - 1]
        const feature = req.body
        await new Promise((resolve, reject) => {
          connection.query(`
          UPDATE
            features
          SET
            name = '${feature.name}',
            position = ${feature.position ?? null},
            track = '${feature.track}',
            type = '${feature.type}',
            difficulty = '${feature.difficulty}',
            status = '${feature.status}'
          WHERE id = '${featureId}';
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
        let features = await getDataFromTable("features")
        if (!features) features = []
        const feature = req.body
        const newId = features.length > 0 ? features[features.length-1].id + 1 : 1
        await new Promise((resolve, reject) => {
          /*
            INSERT INTO features (id, name, position, track, type, difficulty, status)
            VALUES (
              '${features[features.length-1].id + 1}',
              '${feature.name}',
              '${feature.position ?? null}',
              '${feature.track}',
              '${feature.type}',
              '${feature.difficulty}',
              '${feature.status}'
              );
          */
          connection.query(`
          INSERT INTO features (id, name, position, track, type, difficulty, status)
          VALUES (
            '${newId}',
            '${feature.name}',
            ${feature.position ?? null},
            '${feature.track}',
            '${feature.type}',
            '${feature.difficulty}',
            '${feature.status}'
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
        const featureId = pathParams[pathParams.length - 1]
        const result = await new Promise((resolve, reject) => {
          connection.query(`DELETE FROM features WHERE id = ${featureId}`, (err, res) => {
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