const connection = require("../../../connection")
const authMiddleware = require("../../../helpers/authMiddleware")

module.exports = function(fastify, opts, done) {
    // Added GET route for admin - only administrator can get "non-live" alerts
    fastify.route({
        method: "GET",
        preValidation: authMiddleware,
        url: "/",
        handler: async (req, res) => {
            try {
                const result = await new Promise((resolve, reject) => {
                    connection.query('SELECT * FROM alert ORDER BY timestamp DESC;', (error, result) => {
                        if (error) reject(error);
                        resolve(result);
                    });
                });
                return result;
            } catch (error) {
                return error;
            }
        }
    });
    fastify.route({
        method: "POST",
        preValidation: authMiddleware,
        url: "/",
        handler: async (req, res) => {
            const body = req.body;
            try {
                const result = await new Promise((resolve, reject) => {
                    connection.query(
                        `INSERT INTO alert (message, is_live, timestamp)
                        VALUES (?, ?, DEFAULT);`,
                        [
                            body.message,
                            1
                        ],
                        (error, result) => {
                            if (error) reject(error);
                            resolve(result);
                        }
                    );
                });

                return {
                    "success": true,
                    "message": result
                }
            }catch(error){
                return {
                    "success": false,
                    "message": error
                }
            }
        }
    });
    fastify.route({
        method: "PATCH",
        preValidation: authMiddleware,
        url: "/:id",
        handler: async (req, res) => {
            try {
                const pathParams = req.url.split("/");
                const id = pathParams[pathParams.length - 1];
                const message = req.body;
                await new Promise((resolve, reject) => {
                    connection.query(`
                    UPDATE 
                        alert
                    SET
                        message = ?,
                        is_live = ?,
                        timestamp = DEFAULT,
                        billboard = ?
                    WHERE id = ?;
                    `,
                    [
                        message.message,
                        message.is_live ? 1 : 0,
                        message.billboard,
                        id,
                    ], (error, result) => {
                        if (error) reject(error);
                        resolve(result);
                    })
                });
                return {
                    "success": true
                }
            } catch (error) {
                console.log(error);
                return {
                    "success": false,
                    "message": error
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
            await new Promise((resolve, reject) => {
              connection.query('DELETE FROM alert WHERE id = ?', [req.params.id], (error, result) => {
                if (error) reject(error);
                resolve(result)
              })
            })
            return {
              "success": true
            }
          } catch (error) {
            res.code = 500
            return {
              "success": false,
              "message": error
            }
          }
        }
    })
    done();
}