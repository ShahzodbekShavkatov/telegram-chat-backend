const { verify } = require('../util/jwt.js')

const GET = (req, res, next) => {
    try {
        const messages = req.select('messages')
        const { token } = req.headers
        const { userId } = verify(token)

        const messagesFilter = messages.filter( message => message.userId == userId)
        res.json(messagesFilter)
    } catch (error) {
        return next(error)
    }
}

const POST = (req, res, next) => {
    try {
        const { token } = req.headers
        const { userId } = verify(token)
        const messages = req.select('messages')
        const users = req.select('users')

        let { meMessageText, receivingUserId } = req.body

        if(meMessageText && receivingUserId) {

            if(meMessageText.length > 50) throw new Error("Text length is long!")

            let newMessage1 = {
                me: userId,
                date: new Date(),
                messageText: meMessageText
            }

            let newMessage2 = {
                receiver: userId,
                date: new Date(),
                messageText: meMessageText
            }

            let findUser1 = messages.find( message => message.userId == userId && message.receivingUserId == receivingUserId )
            let findUser2 = messages.find( message => message.userId == receivingUserId && message.receivingUserId == userId )
            if(!findUser1 || !findUser2) {
                let obj1 = {
                    userId, 
                    receivingUserId,
                    message: [
                        newMessage1
                    ]
                }
                let obj2 = {
                    receivingUserId: userId,
                    userId: receivingUserId, 
                    message: [
                        newMessage2
                    ]
                }
                messages.push(obj1)
                messages.push(obj2)
                req.insert('messages', messages)

                return res.status(201).json({
                    message: "The message has been added!"
                })
            }

            findUser1.message.push(newMessage1)
            findUser2.message.push(newMessage2)

            req.insert('messages', messages)
            
            return res.status(201).json({
                message: "The message has been added!",
                messages: messages,
                users: users
            })
        }


    } catch (error) {
        return next(error)
    }
}

module.exports = {
    GET,
    POST
}