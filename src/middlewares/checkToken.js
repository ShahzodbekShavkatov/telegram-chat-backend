const { verify } = require('../util/jwt.js')

module.exports = (req, res, next) => {
    try {
        let { token } = req.headers

        if(!token) throw new Error("User is not authorized!")

        const { userId, agent } = verify(token)

        if(!(req.headers['user-agent'] == agent)) throw new Error("Token is invalid!")

        const users = req.select('users')
        let user = users.find( user => user.userId == userId)
        if(!user) throw new Error("Token is invalid!")

        return next()

    } catch(error) {
        return next(error)
    }
}