require('dotenv').config()


const PORT = process.env.PORT || 5656
const TOKEN_TIME = 60 * 60 * 24

module.exports = {
    TOKEN_TIME,
    PORT
}