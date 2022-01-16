const { sign } = require('../util/jwt.js')
const sha256 = require('sha256')
const path = require('path')
const fs = require('fs')

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
        const users = req.select('users')
        const { username, password } = req.body
        const userFound = users.find(user => user.username == username)
        console.log(userFound)

        if (userFound) {
            throw new Error("The user already exists!")
        }

        if (!req.file) {
            throw new Error("The file argument is required!")
        }

        const { size, mimetype, buffer, originalname } = req.file

        if (size > (10 * (2 ** 20))) {
            throw new Error("The file is larger than 10MB!")
        }

        if (!['image/jgp', 'image/jpeg', 'image/png'].includes(mimetype)) {
            throw new Error("The file must be jgp or png!")
        }

        const fileName = Date.now() + originalname.replace(/\s/g, '')
        const pathName = path.join(process.cwd(), 'files', 'profileImages', fileName)
        fs.writeFileSync(pathName, buffer)

        const newUser = {
            userId: users.length ? users[users.length - 1].userId + 1 : 1,
            username,
            profileImg: '/profileImage/' + fileName,
            password: sha256(password)
        }

        users.push(newUser)
        req.insert('users', users)

        delete newUser.password
        res.status(201).json({
            user: newUser,
            message: "The user has successfully registered!",
            token: sign({ userId: newUser.userId, agent: req.headers['user-agent'] })
        })



    } catch (error) {
        return next(error)
    }
}


module.exports = {
    LOGIN,
    REGISTER
}