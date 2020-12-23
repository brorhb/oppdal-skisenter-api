const connection = require("../../connection")
const fetch = require('node-fetch');
const getDataFromTable = require('../../helpers/getDatabaseTable')

var weatherCache
var avalancheCache

module.exports = function (fastify, opts, done) {

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
        difficulty: difficulty_types.find((item) => item.id === track.difficulty)?.label,
        status: status_types.find((status) => status.id === track.status)?.name,
        lifts: track.lifts
          ? JSON.parse(track.lifts).map((id) => lifts.find((lift) => lift.id === id))
          : [],
        connected_tracks: track.connected_tracks
          ? JSON.parse(track.connected_tracks).map((id) => tracks.find((t) => t.id === id))
          : [],
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
    let lift_coords_in_map = await getDataFromTable("lift_coord_in_map")
    lifts = lifts.map((lift) => {
      const coord = lift_coords_in_map.find((item) => item.lift === lift.id)?.coord
      const x = coord?.split(",")[0].trim()
      const y = coord?.split(",")[1].trim()
      const status = status_types.find((status) => status.id === lift.status)?.name
      const type = lift_types.find((type) => type.id === lift.type)?.type
      return {
        ...lift,
        status: status,
        type: type,
        coords: coord ? {
          "x": x,
          "y": y
        } : null
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

  fastify.get("/weather-report", async () => {
    if (weatherCache && (Date.now() - weatherCache.dateTime) < 300000) {
      return weatherCache.result
    } else {
      const urls = [
        `http://api.holfuy.com/live/?s=1346&pw=${process.env.HOLFUY_API_KEY}&m=JSON&tu=C&su=m/s`,
        `http://api.holfuy.com/live/?s=796&pw=${process.env.HOLFUY_API_KEY}&m=JSON&tu=C&su=m/s`
      ]
      const result = await Promise.all([
        ...urls.map(
          (url) => new Promise((resolve, reject) => {
            fetch(url).then(data => resolve(data.json())).catch(err => reject(err))
          })
        )
      ])
      weatherCache = {
        "dateTime": Date.now(),
        "result": result
      }
      return result
    }
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

  fastify.get("/avalanche-warning", async () => {
    if (avalancheCache && (Date.now() - avalancheCache.dateTime) < 3600000) {
      return avalancheCache.result
    } else {
      const result = await new Promise((resolve, reject) => {
        fetch(process.env.AVALANCHE_URL.replaceAll("{date}", createDate()))
          .then(data => resolve(data.json()))
          .catch(err => reject(err))
      })
      let latestWarning = result[0]
      let warning = {
        "region": latestWarning.RegionName,
        "level": latestWarning.DangerLevel,
        "published": latestWarning.PublishTime,
        "message": latestWarning.MainText
      }
      avalancheCache = {
        "dateTime": Date.now(),
        "result": warning
      }
      return warning
    }
  })
  
  fastify.get("/zones", async () => {
    let zones = await getDataFromTable("zones")
    return zones.map((item) => {
      return {
        ...item
      }
    })
  })

  fastify.get("/difficulty", async () => {
    let difficulty = await getDataFromTable("difficulty")
    return difficulty.map((item) => {
      return {
        ...item
      }
    })
  })

  fastify.get("/lift-types", async () => {
    let types = await getDataFromTable("lift_type")
    return types
  })

  done()
}

function createDate() {
  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  let day = `${today.getDate()}`
  if (day.length < 2) day = `0${day}`
  return `${year}-${month}-${day}`
}