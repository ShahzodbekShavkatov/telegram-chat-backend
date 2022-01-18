const express = require('express')
const multer = require('multer')
const { PORT } = require('../config.js')
const cors = require('cors')
const path = require('path')
const app = express()
const fileUpload = multer()

const modelMiddleware = require('./middlewares/model.js')
app.use(express.static(path.join(process.cwd(), 'files')))
app.use(cors())
app.use(modelMiddleware)
app.use(fileUpload.single('file'))
app.use(express.json())


const userRouter = require('./routes/user.js')
const authRouter = require('./routes/auth.js')
const messagesRouter = require('./routes/message.js')
const checkToken = require('./middlewares/checkToken.js')



app.use('/users', checkToken, userRouter)
app.use('/auth', authRouter)
app.use('/messages', checkToken, messagesRouter)



app.use( (error, req, res, next) => {
    // ...
    res.send({ message: error.message })
} )

app.listen(PORT, () => console.log("Backend server is running on http://localhost:" + PORT))