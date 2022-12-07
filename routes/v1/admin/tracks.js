const getDataFromTable = require('../../../helpers/getDatabaseTable')
const authMiddleware = require('../../../helpers/authMiddleware')
const connection = require("../../../connection")

module.exports = function (fastify, opts, done) {
  fastify.route({
    method: "PATCH",
    url: "/:id",
    preValidation: authMiddleware,
    handler: async (req, res) => {
      const pathParams = req.url.split("/")
      const trackId = pathParams[pathParams.length - 1]
      const track = req.body
      try {
        await new Promise((resolve, reject) => {
          connection.query(`
          UPDATE
            tracks
          SET
            name = ?,
            connected_tracks = ?,
            season = ?,
            status = ?,
            length = ?,
            difficulty = ?,
            lifts = ?,
            zone = ?,
            map_name = ?,
          WHERE id = ?
          `,
            [
              track.name,
              JSON.stringify(track.connected_tracks),
              track.season, track.status,
              track["length"],
              track.difficulty,
              JSON.stringify(track.lifts),
              track.zone,
              track.map_name,
              trackId
            ],
            (error, result) => {
              if (error) reject(error)
              resolve(result)
            })
        })
        await new Promise(async (resolve, reject) => {
          const coords = await getDataFromTable("track_coord_in_map", true)
          if (coords.find((item) => item.track == trackId)) {
            connection.query(`
              UPDATE
                track_coord_in_map
              SET
                coord = ?
              WHERE track = ?;
              `, [track.coords, trackId], (error, result) => {
              if (error) reject(error)
              resolve(result)
            }
            )
          } else {
            connection.query(`
              INSERT INTO
                track_coord_in_map (coord, track)
              VALUES (?, ?)
            `, [track.coords, track.id])
          }
        })
      } catch (err) {
        return {
          "success": false,
          "message": err
        }
      }
      return {
        "success": true
      }
    }
  })

  fastify.route({
    method: "PATCH",
    url: "/status",
    preValidation: authMiddleware,
    handler: async (req, res) => {
      const { type } = req.body
      let status_type = 2;
      if (type == "open") status_type = 1
      try {
        await new Promise((resolve, reject) => {
          connection.query(`
          UPDATE
            tracks
          SET
            status = ?
          `, [status_type],
            (error, result) => {
              if (error) reject(error)
              resolve(result)
            })
        })
      } catch (err) {
        return {
          "success": false,
          "message": err
        }
      }
      return {
        "success": true
      }
    }
  })

  fastify.route({
    method: "PATCH",
    url: "/status-zone",
    preValidation: authMiddleware,
    handler: async (req, res) => {
      const { type, zone } = req.body

      let status_type = 3;
      if (type == "open") status_type = 1
      else if (type == "closed") status_type = 2
      try {
        await new Promise((resolve, reject) => {
          connection.query(`
          UPDATE
            tracks
          SET
            status = ?
          WHERE
            zone = ?
          `, [status_type, zone],
            (error, result) => {
              if (error) reject(error)
              resolve(result)
            })
        })
      } catch (err) {
        return {
          "success": false,
          "message": err
        }
      }
      return {
        "success": true
      }
    }
  })


  fastify.route({
    method: "POST",
    preValidation: authMiddleware,
    url: "/add",
    handler: async (req, res) => {
      const tracks = await getDataFromTable("tracks", true)
      const track = req.body
      const newId = tracks.length > 0 ? tracks[tracks.length - 1].id + 1 : 1
      try {
        await new Promise((resolve, reject) => {
          connection.query(`
          INSERT INTO
            tracks (id, name, connected_tracks, season, status, length, difficulty, lifts, zone)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
          `, [newId, track.name, JSON.stringify(track.connected_tracks), track.season, track.status, track["length"], track.difficulty, JSON.stringify(track.lifts), track.zone], (error, result) => {
            if (error) reject(error)
            resolve(result)
          })
        })
      } catch (err) {
        res.code = 500
        return {
          "success": false,
          "message": err
        }
      }
      return {
        "success": true,
        "message": {
          "id": newId
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
        const trackId = pathParams[pathParams.length - 1]
        await new Promise((resolve, reject) => {
          connection.query("DELETE FROM track_coord_in_map WHERE track = ?", [trackId], (err, res) => {
            if (err) reject(err)
            resolve(res)
          })
        })
        const result = await new Promise((resolve, reject) => {
          connection.query("DELETE FROM tracks WHERE id = ?", [trackId], (err, res) => {
            if (err) reject(err)
            resolve(res)
          })
        })
        return {
          "success": true,
          "message": result
        }
      }
      catch (err) {
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