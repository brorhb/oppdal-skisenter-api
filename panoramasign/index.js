require('dotenv').config()
const fastify = require('fastify')({ logger: true })
const authMiddleware = require('.././helpers/authMiddleware');
const panoramaSign = require('./panoramaSign');

fastify.route({
    method: "PATCH",
    url: "/relays",
    preValidation: authMiddleware,
    handler: async (req, res) => {
        let items = req.body
        try {
            let telegrams = await panoramaSign.relaysTelegramConstructor(items);
            let results = [];
            for(let i = 0; i < telegrams.length; i++) {
                let result = await panoramaSign.updatePanoramaSign(telegrams[i]);
                results.push(result)
            }
            return {
                "success": true,
                "results": results
            }
        } catch(err) {
            return {
                "success": false,
                "message": err,
            }
        }
    }
})

fastify.route({
    method: "PATCH",
    url: "/avalanche",
    preValidation: authMiddleware,
    handler: async (req, res) => {
        let color = req.body;
        try {
            let telegram = await panoramaSign.avalancheTelegramConstructor(color);
            let result = await panoramaSign.updatePanoramaSign(telegram);
            return {
                "success": true,
                "results": result
            }
        } catch (error) {
            return {
                "success": false,
                "message": error
            }
        }
    }
})

fastify.route({
    method: "PATCH",
    url: "/clear-relays",
    preValidation: authMiddleware,
    handler: async (req, res) => {
        try {
            let telegram = await panoramaSign.setAllRelaysTelegramConstructor(false);
            let result = await panoramaSign.updatePanoramaSign(telegram);
            return {
                "success": true,
                "results": result
            }
        } catch (error) {
            return {
                "success": false,
                "results": result
            }
        }
    }
})

const start = async () => {
  try {
    fastify.register(require('fastify-cors'))
    await fastify.listen(process.env.PORT || 5001, '0.0.0.0')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()