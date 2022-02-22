require('dotenv').config();
const fastify = require('fastify')({ logger: true });
const authMiddleware = require('.././helpers/authMiddleware');
const panoramaSign = require('./panoramaSign');

fastify.get('/temp', async (request, reply) => {
  let telegram = await panoramaSign.temperatureTelegramConstructor();
  let result = await panoramaSign.updatePanoramaSign([telegram]);
  result = Object.values(result);
  reply.send(result);
});

fastify.route({
  method: 'PATCH',
  url: '/relays',
  preValidation: authMiddleware,
  handler: async (req, res) => {
    let items = req.body;
    try {
      let telegrams = await panoramaSign.relaysTelegramConstructor(items);
      let results = [];
      if (process.env.NODE_ENV !== 'development') {
        let result = await panoramaSign.updatePanoramaSign(telegrams);
        results.push(result);
      }
      console.log('results', results);
      res
        .code(200)
        .header('Content-Type', 'application/json; charset=utf-8')
        .send({
          success: true,
          results: results,
        });
    } catch (err) {
      console.log('ERROR', err);
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
    let { message, time } =
      process.env.NODE_ENV === 'production' ? req.body : JSON.parse(req.body);
    try {
      let telegrams = await panoramaSign.billboardMessageConstructor(
        message,
        time
      );
      let results = {};
      if (process.env.NODE_ENV !== 'development') {
        results = await panoramaSign.sendMessageToBillboards(telegrams);
      }
      res
        .code(200)
        .header('Content-Type', 'application/json; charset=utf-8')
        .send({
          success: true,
          results: results,
        });
    } catch (err) {
      console.log('ERROR', err);
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
  url: '/avalanche',
  preValidation: authMiddleware,
  handler: async (req, res) => {
    let color = req.body;
    try {
      let telegram = await panoramaSign.avalancheTelegramConstructor(color);
      let result;
      if (process.env.NODE_ENV !== 'development') {
        result = await panoramaSign.updatePanoramaSign([telegram]);
      }
      res
        .code(200)
        .header('Content-Type', 'application/json; charset=utf-8')
        .send({
          success: true,
          telegram: telegram,
          results: result,
        });
    } catch (error) {
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
  method: 'POST',
  url: '/clear-relays',
  preValidation: authMiddleware,
  handler: async (req, res) => {
    try {
      let telegrams = await panoramaSign.clearAllRelaysTelegramConstructor();
      let results = [];
      if (process.env.NODE_ENV !== 'development') {
        let result = await panoramaSign.updatePanoramaSign(telegrams);
        results.push(result);
      }
      res
        .code(200)
        .header('Content-Type', 'application/json; charset=utf-8')
        .send({
          success: true,
          results: results,
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

const start = async () => {
  try {
    fastify.register(require('fastify-cors'));
    await fastify.listen(process.env.PORT || 5001, '0.0.0.0');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();