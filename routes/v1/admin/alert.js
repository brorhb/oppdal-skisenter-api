const connection = require("../../../connection")
const authMiddleware = require("../../../helpers/authMiddleware")

module.exports = function(fastify, opts, done) {
    fastify.route({
        method: "POST",
        preValidation: authMiddleware,
        url: "/",
        handler: async (req, res) => {
            const message = req.body;
            try {
                const result = await new Promise((resolve, reject) => {
                    connection.query(`
                    INSERT INTO alert (message, is_live, timestamp)
                    VALUES (?, ?, ?);
                    `, [message, 1, createDate()], (error, result) => {
                        if (error) reject(error);
                        resolve(result);
                    });
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
                        timestamp = ?
                    WHERE id = '${id}';
                    `, [message.message, message.is_live ? 1 : 0, createDate()], (error, result) => {
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

function createDate() {
    const today = new Date()
    const year = today.getFullYear()
    const month = today.getMonth()
    let day = `${today.getDate()}`
    if (day.length < 2) day = `0${day}`
    return `${year}-${month}-${day}`
}