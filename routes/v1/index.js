const connection = require("../../connection")
const fetch = require('node-fetch');
const getDataFromTable = require('../../helpers/getDatabaseTable')
const getAlerts = require('../../helpers/getAlerts');
const getSnowconditions = require('../../helpers/getSnowconditions')
var weatherCache = {
  dateTime: Date.now() - 300001,
  result: [
    {
      stationId: 796,
      stationName: 'Vangshøa_ Oppdal',
      dateTime: '2021-11-22 17:48:17',
      wind: {
        speed: 4.7,
        gust: 6.1,
        min: 4.2,
        unit: 'm/s',
        direction: 264,
      },
      light: 0,
      daily: {
        max_temp: 0,
        min_temp: -7.7,
      },
      temperature: -5,
      zone: 1,
    },
    {
      stationId: 1346,
      stationName: 'Vangslia_ Oppdal',
      dateTime: '2021-11-22 17:48:28',
      wind: {
        speed: 10,
        gust: 11.4,
        min: 8.6,
        unit: 'm/s',
        direction: 296,
      },
      humidity: 95.9,
      pressure: 963,
      daily: {
        max_temp: -1.2,
        min_temp: -6.6,
      },
      temperature: -3.8,
      zone: 1,
    },
    {
      stationId: 1377,
      stationName: 'Stølen_ Oppdal',
      dateTime: '2021-11-22 17:47:40',
      wind: {
        speed: 6.4,
        gust: 7.8,
        min: 4.7,
        unit: 'm/s',
        direction: 25,
      },
      humidity: 95.6,
      pressure: 904.4,
      daily: {
        max_temp: 0.1,
        min_temp: -5.8,
      },
      temperature: -2.4,
      zone: 4,
    },
  ],
};
var avalancheCache;
var rainCache;

module.exports = function (fastify, opts, done) {
  fastify.register(require('./admin'), { prefix: '/admin' });

  fastify.get('/tracks', async () => {
    let tracks = await getDataFromTable('tracks');
    let lifts = await getDataFromTable('lifts');
    let difficulty_types = await getDataFromTable('difficulty');
    let status_types = await getDataFromTable('status_types');
    let track_coords_in_map = await getDataFromTable('track_coord_in_map');
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

  fastify.get('/lifts', async () => {
    let lifts = await getDataFromTable('lifts');
    let status_types = await getDataFromTable('status_types');
    let lift_types = await getDataFromTable('lift_type');
    let lift_coords_in_map = await getDataFromTable('lift_coord_in_map');
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

  fastify.get('/features', async () => {
    let features = await getDataFromTable('features');
    let feature_types = await getDataFromTable('feature_types');
    let tracks = await getDataFromTable('tracks');
    let difficulty_types = await getDataFromTable('difficulty');
    let status_types = await getDataFromTable('status_types');
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

  fastify.get('/facilities', async () => {
    let facilities = await getDataFromTable('facilities');
    let facility_types = await getDataFromTable('facilities_types');
    let status_types = await getDataFromTable('status_types');
    return facilities.map((facility) => {
      return {
        ...facility,
        status: status_types.find((status) => status.id === facility.status),
        type: facility_types.find((item) => item.id === facility.type),
      };
    });
  });

  fastify.get('/weather-report', async () => {
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

      if (weatherCache) {
        const cache = weatherCache.result;
        let inCache = [];
        for (var i = 0; i < results.length; i++) {
          let item = results[i];
          if (cache.find((station) => station.stationId === item.stationId)) {
            let index = cache.findIndex(
              (station) => station.stationId === item.stationId
            );
            inCache.push({
              index: index,
              item: item,
            });
          }
        }
        let newCache = cache;
        inCache.forEach((item) => {
          newCache[item.index] = item.item;
        });

        weatherCache = {
          dateTime: Date.now(),
          result: newCache.map((station) => {
            station['zone'] = weatherStationZones.find(
              (item) => item.station_id === station.stationId
            )?.zone_id;
            return station;
          }),
        };
      }
      return weatherCache.result;
    }
  });

  fastify.get('/rain-report', async () => {
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

  fastify.get('/avalanche-warning', async () => {
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

  fastify.get('/update-table', async () => {
    await new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, 300);
    });
    return {
      message: 'sucessfully emulated table update',
    };
  });

  fastify.get('/zones', async () => {
    let zones = await getDataFromTable('zones');
    return zones.map((item) => {
      return {
        ...item,
      };
    });
  });

  fastify.get('/cameras', async () => {
    let cameras = await getDataFromTable('camera');
    return cameras.map((item) => {
      return item;
    });
  });

  fastify.get('/difficulty', async () => {
    let difficulty = await getDataFromTable('difficulty');
    return difficulty.map((item) => {
      return {
        ...item,
      };
    });
  });

  fastify.get('/lift-types', async () => {
    let types = await getDataFromTable('lift_type');
    return types;
  });

  fastify.get('/alert', async () => {
    let messages = await getAlerts();
    return messages;
  });

  fastify.get('/snow-conditions', async () => {
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

function formatDate(date){
  let year = date.getFullYear();
  let month = date.getMonth();
  month++;
  let day = `${date.getDate()}`
  if (day.length < 2) day = `0${day}`;
  return `${year}-${month}-${day}`;
}