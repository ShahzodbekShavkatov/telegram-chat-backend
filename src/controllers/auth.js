const { sign } = require('../util/jwt.js')
const sha256 = require('sha256')

const LOGIN = (req, res, next) => {
    try {
        const { username, password } = req.body
        if (!username || !password) throw new Error("Username and password are required!")

        const users = req.select('users')
        const user = users.find(user => user.username == username && user.password == sha256(password))

        if (!user) throw new Error("Wrong username or password!")

        delete user.password
        return res.status(200).json({
            user,
            message: "The user has successfully logged in!",
            token: sign({ userId: user.userId, agent: req.headers['user-agent'] })
        })
        
    } catch (error) {
        return next(error)
    }
}

const REGISTER = (req, res, next) => {
    try {

    } catch (error) {
        return next(error)
    }
}


module.exports = {
    LOGIN,
    REGISTER
}