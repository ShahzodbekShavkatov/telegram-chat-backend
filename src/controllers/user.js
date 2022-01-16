const GET = (req, res, next) => {
    try {
        const users = req.select('users')
        res.json(users)
    } catch (error) {
        return next(error)
    }
}

module.exports = {
    GET
}