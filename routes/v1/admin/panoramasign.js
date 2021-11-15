const authMiddleware = require('../../../helpers/authMiddleware');
const fetch = require('node-fetch');

module.exports = function (fastify, opts, done) {
  fastify.route({
    method: 'PATCH',
    url: '/relays',
    preValidation: authMiddleware,
    handler: async (req, res) => {
      const token = req.headers.authorization;
      try {
        let lifts = await getDataFromTable('lifts');
        let tracks = await getDataFromTable('tracks');
        let facilities = await getDataFromTable('facilities');

        let items = [...lifts, ...tracks];
        let url = process.env.DO_URL;
        fetch(url + '/relays', {
          method: 'PATCH',
          body: JSON.stringify(items),
          headers: { Authorization: token, 'Content-Type': 'application/json' },
        })
          .then((data) => data.json())
          .then((data) => {
            console.log(data);
            return {
              success: true,
              results: data,
            };
          })
          .catch((error) => {
            console.log(error);
            return {
              success: false,
              results: error,
            };
          });
      } catch (err) {
        return {
          success: false,
          message: err,
        };
      }
    },
  });

  fastify.route({
    method: 'PATCH',
    url: '/message',
    preValidation: authMiddleware,
    handler: async (req, res) => {
      console.log(req.body);
      const token = req.headers.authorization;
      try {
        let url = process.env.DO_URL;
        console.log('TRYING TO PATCH URL', url + '/message', body);
        let result = fetch(url + '/message', {
          method: 'PATCH',
          body: JSON.stringify(req.body),
          headers: { Authorization: token, 'Content-Type': 'application/json' },
        });
        let json = await result.json();
        return {
          success: true,
          results: json,
        };
      } catch (err) {
        return {
          success: false,
          message: err,
        };
      }
    },
  });

  fastify.route({
    method: 'PATCH',
    url: '/avalanche',
    preValidation: authMiddleware,
    handler: async (req, res) => {
      const token = req.headers.authorization;
      try {
        /**
         * Color options:
         * 0: green
         * 1: yellow
         * 2: red
         */
        let color = req.body;
        let url = process.env.DO_URL;
        fetch(url + '/avalanche', {
          method: 'PATCH',
          body: JSON.stringify(color),
          headers: { Authorization: token, 'Content-Type': 'application/json' },
        })
          .then((data) => data.json())
          .then((data) => {
            console.log(data);
            return {
              success: true,
              results: data,
            };
          })
          .catch((error) => {
            console.log(error);
            return {
              success: false,
              results: error,
            };
          });
      } catch (err) {
        return {
          success: false,
          message: err,
        };
      }
    },
  });
  fastify.route({
    method: 'PATCH',
    url: '/clear-relays',
    preValidation: authMiddleware,
    handler: async (req, res) => {
      const token = req.headers.authorization;
      try {
        let url = process.env.DO_URL;
        fetch(url + '/clear-relays', {
          method: 'PATCH',
          headers: { Authorization: token, 'Content-Type': 'application/json' },
        })
          .then((data) => data.json())
          .then((data) => {
            return {
              success: true,
              results: data,
            };
          })
          .catch((error) => {
            console.log(error);
            return {
              success: false,
              results: error,
            };
          });
      } catch (err) {
        return {
          success: false,
          message: err,
        };
      }
    },
  });
  done();
};
