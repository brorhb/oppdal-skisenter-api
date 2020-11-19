const connection = require("../../connection")

module.exports = function (fastify, opts, done) {
  const getDataFromTable = (tableName) => {
    return new Promise((resolve, reject) => {
      connection.query(`SELECT * FROM ${tableName};`,(err, result) => {
        if (err) reject(err)
        resolve(result)
      })
    })
  }

  fastify.register(require('./admin'), { prefix: '/admin' })

  fastify.get("/tracks", async () => {
    let tracks = await getDataFromTable("tracks")
    let lifts = await getDataFromTable("lifts")
    let difficulty_types = await getDataFromTable("difficulty")
    let status_types = await getDataFromTable("status_types")
    let track_coords_in_map = await getDataFromTable("track_coord_in_map")
    tracks = tracks.map((track) => {
      const coord = track_coords_in_map.find((item) => item.track === track.id)?.coord
      const x = coord?.split(",")[0].trim()
      const y = coord?.split(",")[1].trim()
      return {
        ...track,
        difficulty: difficulty_types.find((item) => item.id === track.difficulty).label,
        status: status_types.find((status) => status.id === track.status).name,
        lifts: track.lifts
          ? JSON.parse(track.lifts).map((id) => lifts.find((lift) => lift.id === id))
          : null,
        connected_tracks: track.connected_tracks
          ? JSON.parse(track.connected_tracks).map((id) => tracks.find((t) => t.id === id))
          : null,
        coords: coord ? {
          "x": x,
          "y": y
        } : null
      }
    })
    return tracks
  })
  
  fastify.get("/lifts", async () => {
    let lifts = await getDataFromTable("lifts")
    let status_types = await getDataFromTable("status_types")
    let lift_types = await getDataFromTable("lift_type")
    lifts = lifts.map((lift) => {
      return {
        ...lift,
        status: status_types.find((status) => status.id === lift.status).name,
        type: lift_types.find((type) => type.id === lift.type).type
      }
  
    })
    return lifts
  })
  
  fastify.get("/features", async () => {
    let features = await getDataFromTable("features")
    let feature_types = await getDataFromTable("feature_types")
    let tracks = await getDataFromTable("tracks")
    let difficulty_types = await getDataFromTable("difficulty")
    let status_types = await getDataFromTable("status_types")
    features = features.map((feature) => {
      return {
        ...feature,
        type: feature_types.find((type) => type.id === feature.type),
        track: tracks.find((track) => track.id === feature.track),
        difficulty: difficulty_types.find((item) => item.id === feature.difficulty).label,
        status: status_types.find((status) => status.id === feature.status).name,
      }
    })
    return features
  })

  fastify.get("/facilities", async () => {
    let facilities = await getDataFromTable("facilities")
    let facility_types = await getDataFromTable("facilities_types")
    let status_types = await getDataFromTable("status_types")
    return facilities.map((facility) => {
      return {
        ...facility,
        status: status_types.find((status) => status.id === facility.status),
        type: facility_types.find((item) => item.id === facility.type)
      }
    })
  })

  fastify.get("/update-table", async () => {
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve()
      }, 300)
    })
    return {
      "message": "sucessfully emulated table update"
    }
  })

  fastify.get("/avalanche-warnings", async () => {
    let warnings = await getDataFromTable("avalanche_log")
    let levels = await getDataFromTable("avalanche_levels")
    return warnings.map((item) => {
      return {
        ...item,
        level: levels.find((level) => level.id === item.level)
      }
    })
  })

  done()
}