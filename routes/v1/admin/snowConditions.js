const connection = require("../../../connection")
const authMiddleware = require("../../../helpers/authMiddleware")

module.exports = function(fastify, opts, done) {
    fastify.route({
        method: "GET",
        preValidation: authMiddleware,
        url: "/",
        handler: async (req, res) => {
            try {
                const result = await new Promise((resolve, reject) => {
                    connection.query(`
                    SELECT * FROM snow_conditions;
                    `, (error, result) => {
                        if(error) reject(error);
                        resolve(result);
                    });
                });
                return result
            } catch (error) {
                return {
                    "success": false,
                    "message": error
                }
            }
        }
    })
    fastify.route({
        method: "POST",
        preValidation: authMiddleware,
        url: "/",
        handler: async (req, res) => {
            const {message} = req.body;
            try {
                const result = await new Promise((resolve, reject) => {
                    connection.query(`
                    INSERT INTO snow_conditions (message, is_live, timestamp)
                    VALUES (?, ?, ?);
                    `, [message, 0, createDate()], (error, result) => {
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
                const id = req.params.id;
                const message = req.body;
                await new Promise((resolve, reject) => {
                    connection.query(`
                    UPDATE 
                        snow_conditions
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
              connection.query('DELETE FROM snow_conditions WHERE id = ?', [req.params.id], (error, result) => {
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
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();
    let time = today.getHours();
    let min = today.getMinutes();
    if (month < 10) month = `0${month}`;
    if (day < 10) day = `0${day}`;
    if (time < 10) time = `0${time}`;
    if (min < 10) min = `0${min}`;
    return `${year}-${month}-${day}T${time}:${min}:00Z`
};