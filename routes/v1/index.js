const connection = require("../../connection")
const fetch = require('node-fetch');
const getDataFromTable = require('../../helpers/getDatabaseTable')
const getAlerts = require('../../helpers/getAlerts');
const getSnowconditions = require('../../helpers/getSnowconditions')
var weatherCache;
var avalancheCache;
var rainCache;

module.exports = function (fastify, opts, done) {
  fastify.register(require('./admin'), { prefix: '/admin' });

  fastify.get('/tracks', async (req) => {
    const token = req.headers.authorization?.split(" ")[1]
    const updateCache = typeof token !== 'undefined' && token.lenght > 0
    let tracks = await getDataFromTable('tracks', updateCache);
    let lifts = await getDataFromTable('lifts', updateCache);
    let difficulty_types = await getDataFromTable('difficulty', updateCache);
    let status_types = await getDataFromTable('status_types', updateCache);
    let track_coords_in_map = await getDataFromTable('track_coord_in_map', updateCache);
    tracks = tracks.map((track) => {
      const coord = track_coords_in_map.find(
        (item) => item.track === track.id
      )?.coord;
      const x = coord?.split(',')[0].trim();
      const y = coord?.split(',')[1].trim();
      return {
        ...track,
        difficulty: difficulty_types.find(
          (item) => item.id === track.difficulty
        )?.label,
        status: status_types.find((status) => status.id === track.status)?.name,
        lifts: track.lifts
          ? JSON.parse(track.lifts).map((id) =>
            lifts.find((lift) => lift.id === id)
          )
          : [],
        connected_tracks: track.connected_tracks
          ? JSON.parse(track.connected_tracks).map((id) =>
            tracks.find((t) => t.id === id)
          )
          : [],
        coords: coord
          ? {
            x: x,
            y: y,
          }
          : null,
      };
    });
    return tracks;
  });

  fastify.post('/analytics', async (request, reply) => {
    const {
      referrer,
      url,
      uuid
    } = JSON.parse(request.body);
    const userAgent = request.headers['user-agent'];
    if (typeof uuid === 'string' && uuid.length > 0) {
      await new Promise((resolve, reject) => {
        connection.query(`
        INSERT INTO analytics (uuid, site, referrer, useragent) VALUES (?, ?, ?, ?)
      `, [uuid, url, referrer, userAgent], (error, result) => {
          if (error) reject(error);
          resolve(result);
        })
      })
    }
    reply.code(200).send();
  })

  fastify.get('/daily-unique-users', async (request, reply) => {
    const result = await new Promise((resolve, reject) => {
      connection.query(`
        SELECT DISTINCT uuid, referrer, useragent from analytics WHERE time LIKE CONCAT("%", CURRENT_DATE, "%");
      `, (error, result) => {
        if (error) reject(error);
        resolve(result);
      })
    })
    const android = result.filter((item) => item.useragent.includes('Android'));
    const iPhones = result.filter((item) => item.useragent.includes('iPhone'));
    const iPads = result.filter((item) => item.useragent.includes('iPad'));
    let response = {
      total: result.length,
      iPhones: iPhones.length,
      iPads: iPads.length,
      android: android.length,
      other: result.length - (iPhones.length + iPads.length + android.length),
      cameFromMainSite: result.filter((item) => item.referrer.includes("oppdalskisenter")).length,
    }
    reply.code(200).send(response);
  })

  fastify.get('/lifts', async (req) => {
    const token = req.headers.authorization?.split(" ")[1]
    const updateCache = typeof token !== 'undefined'
    let lifts = await getDataFromTable('lifts', updateCache);
    let status_types = await getDataFromTable('status_types', updateCache);
    let lift_types = await getDataFromTable('lift_type', updateCache);
    let lift_coords_in_map = await getDataFromTable('lift_coord_in_map', updateCache);
    lifts = lifts.map((lift) => {
      const coord = lift_coords_in_map.find(
        (item) => item.lift === lift.id
      )?.coord;
      const x = coord?.split(',')[0].trim();
      const y = coord?.split(',')[1].trim();
      const status = status_types.find(
        (status) => status.id === lift.status
      )?.name;
      const type = lift_types.find((type) => type.id === lift.type)?.type;
      return {
        ...lift,
        status: status,
        type: type,
        coords: coord
          ? {
            x: x,
            y: y,
          }
          : null,
      };
    });
    return lifts;
  });

  fastify.get('/features', async (req) => {
    const token = req.headers.authorization?.split(" ")[1]
    const updateCache = typeof token !== 'undefined' && token.lenght > 0
    let features = await getDataFromTable('features', updateCache);
    let feature_types = await getDataFromTable('feature_types', updateCache);
    let tracks = await getDataFromTable('tracks', updateCache);
    let difficulty_types = await getDataFromTable('difficulty', updateCache);
    let status_types = await getDataFromTable('status_types', updateCache);
    features = features.map((feature) => {
      return {
        ...feature,
        type: feature_types.find((type) => type.id === feature.type),
        track: tracks.find((track) => track.id === feature.track),
        difficulty: difficulty_types.find(
          (item) => item.id === feature.difficulty
        ).label,
        status: status_types.find((status) => status.id === feature.status)
          .name,
      };
    });
    return features;
  });

  fastify.get('/facilities', async (req) => {
    const token = req.headers.authorization?.split(" ")[1]
    const updateCache = typeof token !== 'undefined' && token.lenght > 0
    let facilities = await getDataFromTable('facilities', updateCache);
    let facility_types = await getDataFromTable('facilities_types', updateCache);
    let status_types = await getDataFromTable('status_types', updateCache);
    return facilities.map((facility) => {
      return {
        ...facility,
        status: status_types.find((status) => status.id === facility.status),
        type: facility_types.find((item) => item.id === facility.type),
      };
    });
  });

  fastify.get('/weather-report', async (req) => {
    if (weatherCache && Date.now() - weatherCache.dateTime < 300000) {
      return weatherCache.result;
    } else {
      let weatherStations = await getDataFromTable('weather_station');
      let weatherStationZones = await getDataFromTable('weather_station_zone');
      const urls = [
        ...weatherStations.map((item) => {
          if (item.url.includes('{PASSWORD}')) {
            item.url = item.url.replace(
              '{PASSWORD}',
              process.env.HOLFUY_API_KEY
            );
          }
          return item.url;
        }),
      ];
      let results = [];
      await Promise.all([
        ...urls.map(
          (url) =>
            new Promise((resolve, reject) => {
              fetch(url)
                .then((data) => data.json())
                .then((data) => {
                  if ('measurements' in data)
                    results = [...results, ...data.measurements];
                  else results = [...results, data];
                  resolve(results);
                })
                .catch((err) => reject(err));
            })
        ),
      ]);

      results = results.filter((station) => !station.error);

      weatherCache = {
        dateTime: Date.now(),
        result: results.map((station) => {
          station['zone'] = weatherStationZones.find(
            (item) => item.station_id === station.stationId
          )?.zone_id;
          return station;
        }),
      };
      return weatherCache.result;
    }
  });

  fastify.get('/rain-report', async (req) => {
    if (rainCache && Date.now() - rainCache.dateTime < 3600000) {
      return rainCache.result;
    } else {
      const url = `${process.env.MET_URL}`.toString();
      const result = await new Promise((resolve, reject) => {
        fetch(url, {
          headers: {
            'User-Agent': `${process.env.sitename}`,
          },
        })
          .then(async (response) => {
            try {
              const data = await response.json();
              const rainData = data.properties.timeseries;
              resolve(rainData);
            } catch (error) {
              console.error(error);
            }
          })
          .catch((error) => reject(error));
      });
      rainCache = {
        dateTime: Date.now(),
        result: result,
      };
      return result;
    }
  });

  fastify.get('/avalanche-warning', async (req) => {
    if (avalancheCache && Date.now() - avalancheCache.dateTime < 3600000) {
      return avalancheCache.result;
    } else {
      const url = `${process.env.AVALANCHE_URL}`.toString();
      let dates = createDatesForAvalancheWarning();
      let formattedUrl = url.replace('{date}', dates[0]);
      formattedUrl = formattedUrl.replace('{date}', dates[1]);
      const result = await new Promise((resolve, reject) => {
        fetch(formattedUrl)
          .then((data) => resolve(data.json()))
          .catch((err) => reject(err));
      });
      avalancheCache = {
        dateTime: Date.now(),
        result: result,
      };
      return result;
    }
  });

  fastify.get('/zones', async (req) => {
    const token = req.headers.authorization?.split(" ")[1]
    const updateCache = typeof token !== 'undefined' && token.lenght > 0
    let zones = await getDataFromTable('zones', updateCache);
    return zones.map((item) => {
      return {
        ...item,
      };
    });
  });

  fastify.get('/cameras', async (req) => {
    const token = req.headers.authorization?.split(" ")[1]
    const updateCache = typeof token !== 'undefined' && token.lenght > 0
    let cameras = await getDataFromTable('camera', updateCache);
    return cameras.map((item) => {
      return item;
    });
  });

  fastify.get('/difficulty', async (req) => {
    const token = req.headers.authorization?.split(" ")[1]
    const updateCache = typeof token !== 'undefined' && token.lenght > 0
    let difficulty = await getDataFromTable('difficulty', updateCache);
    return difficulty.map((item) => {
      return {
        ...item,
      };
    });
  });

  fastify.get('/lift-types', async (req) => {
    const token = req.headers.authorization?.split(" ")[1]
    const updateCache = typeof token !== 'undefined' && token.lenght > 0
    let types = await getDataFromTable('lift_type', updateCache);
    return types;
  });

  fastify.get('/alert', async (req) => {
    let messages = await getAlerts();
    return messages;
  });

  fastify.get('/snow-conditions', async (req) => {
    let conditions = await getSnowconditions();
    return conditions;
  });
  done();
};

function createDatesForAvalancheWarning() {
  let dates = [];
  let date = new Date();
  date.setDate(date.getDate() - 4);
  dates.push(formatDate(date));

  date = new Date();
  date.setDate(date.getDate() + 2);
  dates.push(formatDate(date));

  // TEMP DATES FOR BRUKERTEST
  /*let tempDates = ["2020-12-21", "2020-12-27"]
  return tempDates*/
  return dates;
}

function formatDate(date) {
  let year = date.getFullYear();
  let month = date.getMonth();
  month++;
  let day = `${date.getDate()}`
  if (day.length < 2) day = `0${day}`;
  return `${year}-${month}-${day}`;
}