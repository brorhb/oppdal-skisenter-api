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
        let lifts = await getDataFromTable('lifts', true);
        let tracks = await getDataFromTable('tracks', true);
        let facilities = await getDataFromTable('facilities', true);

        let items = [...lifts, ...tracks, ...facilities];
        let url = process.env.DO_URL;
        fetch(url + '/relays', {
          method: 'PATCH',
          body: JSON.stringify(items),
          headers: { Authorization: token, 'Content-Type': 'application/json' },
        })
          .then((data) => data.json())
          .then((data) => {
            console.log(data);
            res
              .code(200)
              .header('Content-Type', 'application/json; charset=utf-8')
              .send({
                success: true,
                results: data,
              });
          })
          .catch((error) => {
            console.log(error);
            res
              .code(500)
              .header('Content-Type', 'application/json; charset=utf-8')
              .send({
                success: false,
                results: error,
              });
          });
      } catch (err) {
        res
          .code(500)
          .header('Content-Type', 'application/json; charset=utf-8')
          .send({
            success: false,
            message: err,
          });
      }
    },
  });

  fastify.route({
    method: 'PATCH',
    url: '/message',
    preValidation: authMiddleware,
    handler: async (req, res) => {
      const token = req.headers.authorization;
      let url = process.env.DO_URL;
      try {
        let result = await fetch(url + '/message', {
          method: 'PATCH',
          body: JSON.stringify(req.body),
          headers: { Authorization: token, 'Content-Type': 'application/json' },
        });
        let json = await result.json();
        res
          .code(200)
          .header('Content-Type', 'application/json; charset=utf-8')
          .send({
            success: true,
            results: json,
          });
      } catch (err) {
        res
          .code(500)
          .header('Content-Type', 'application/json; charset=utf-8')
          .send({
            success: false,
            message: err,
          });
      }
    },
  });

  fastify.route({
    method: 'PATCH',
    url: '/message/:id',
    preValidation: authMiddleware,
    handler: async (req, res) => {
      const pathParams = req.url.split("/")
      const billboardId = pathParams[pathParams.length - 1]
      const token = req.headers.authorization;
      let url = process.env.DO_URL;
      try {
        let result = await fetch(url + `/message/${billboardId}`, {
          method: 'PATCH',
          body: JSON.stringify(req.body),
          headers: { Authorization: token, 'Content-Type': 'application/json' },
        });
        let json = await result.json();
        res
          .code(200)
          .header('Content-Type', 'application/json; charset=utf-8')
          .send({
            success: true,
            results: json,
          });
      } catch (err) {
        res
          .code(500)
          .header('Content-Type', 'application/json; charset=utf-8')
          .send({
            success: false,
            message: err,
          });
      }
    }
  })

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
        let url = process.env.DO_URL;
        fetch(url + '/avalanche', {
          method: 'PATCH',
          body: JSON.stringify(req.body),
          headers: { Authorization: token, 'Content-Type': 'application/json' },
        })
          .then((data) => data.json())
          .then((data) => {
            res
              .code(200)
              .header('Content-Type', 'application/json; charset=utf-8')
              .send({
                success: true,
                results: data,
              });
          })
          .catch((error) => {
            res
              .code(500)
              .header('Content-Type', 'application/json; charset=utf-8')
              .send({
                success: false,
                results: error,
              });
          });
      } catch (err) {
        res
          .code(500)
          .header('Content-Type', 'application/json; charset=utf-8')
          .send({
            success: false,
            message: err,
          });
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
          method: 'POST',
          headers: { Authorization: token },
        })
          .then((data) => data.json())
          .then((data) => {
            res
              .code(200)
              .header('Content-Type', 'application/json; charset=utf-8')
              .send({
                success: true,
                results: data,
              });
          })
          .catch((error) => {
            console.log(error);
            res
              .code(500)
              .header('Content-Type', 'application/json; charset=utf-8')
              .send({
                success: false,
                results: error,
              });
          });
      } catch (err) {
        res
          .code(500)
          .header('Content-Type', 'application/json; charset=utf-8')
          .send({
            success: false,
            message: err,
          });
      }
    },
  });
  done();
};
