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
                    INSERT INTO important_message (message, is_live, timestamp)
                    VALUES (?, ?, ?);
                    `, [message.newMessage, 1, createDate()], (error, result) => {
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
                        important_message
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