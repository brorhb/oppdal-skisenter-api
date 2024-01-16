const connection = require("../../../connection")
const jwt = require('jsonwebtoken')
const getDataFromTable = require('../../../helpers/getDatabaseTable')
const authMiddleware = require('../../../helpers/authMiddleware')
const { createHash, compareHash } = require('../../../helpers/hasher')

module.exports = function (fastify, opts, done) {
  fastify.register(require('./tracks'), { prefix: '/track' });
  fastify.register(require('./lifts'), { prefix: '/lift' });
  fastify.register(require('./facilities'), { prefix: '/facility' });
  fastify.register(require('./zones'), { prefix: '/zone' });
  fastify.register(require('./features'), { prefix: '/feature' });
  fastify.register(require('./avalanches'), { prefix: '/avalanche' });
  fastify.register(require('./alert'), { prefix: '/alert' });
  fastify.register(require('./camera'), { prefix: '/camera' });
  fastify.register(require('./snowConditions'), { prefix: '/snow-conditions' });
  fastify.register(require('./panoramasign'), { prefix: '/panoramasign' });
  fastify.route({
    method: 'POST',
    url: '/create',
    preValidation: authMiddleware,
    handler: async (req, res) => {
      const hash = await createHash(req.body.password);
      const username = req.body.username;
      const user = {
        username: username,
        password: hash,
        role: 1,
      };
      let result = await new Promise((resolve, reject) => {
        connection.query(
          'INSERT INTO users SET username = ?, password = ?, role = ?',
          [user.username, user.password, user.role],
          (err, result) => {
            if (err) reject(err);
            resolve(result);
          }
        );
      });
      if (result) {
        return {
          status: 'success',
          message: 'User created successfully',
          data: user,
        };
      } else {
        return {
          status: 'error',
          message: 'User not created',
          data: user,
        };
      }
    },
  });

  fastify.route({
    method: 'PATCH',
    url: '/toggle-status/:type/:id/:status',
    preValidation: authMiddleware,
    handler: async (req, res) => {
      try {
        const pathParams = req.url.split('/');
        const type = pathParams[pathParams.length - 3];
        const id = pathParams[pathParams.length - 2];
        const status = pathParams[pathParams.length - 1];
        await new Promise((resolve, reject) => {
          connection.query(
            `
            UPDATE ${type}
            SET status = ?
            WHERE id = ?
            `,
            [parseInt(status), parseInt(id)],
            (error, result, fields) => {
              if (error) reject(error);
              resolve(result);
            }
          );
        });
        return {
          success: true,
        };
      } catch (err) {
        return {
          success: false,
          message: err,
        };
      }
    },
  });

  fastify.post('/login', async (req, res) => {
    const password = req.body.password;
    const username = req.body.username;
    const users = await getDataFromTable('users', true);
    const user = users.find(
      (item) =>
        item.username === username && compareHash(password, item.password)
    );
    let refreshToken = jwt.sign(
      {
        exp:
          Math.floor(Date.now() / 1000) +
          parseInt(process.env.REFRESH_TOKEN_LIFE),
        data: JSON.stringify({
          id: user.id,
          username: user.username,
          role: user.role,
        }),
      },
      process.env.REFRESH_TOKEN_SECRET
    );
    return {
      user: {
        username: user.username,
        role: user.role,
      },
      token: refreshToken,
    };
  });

  fastify.get('/test-auth', { preValidation: authMiddleware }, (req, res) => {
    return 'Hello world';
  });

  done();
}