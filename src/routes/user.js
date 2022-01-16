const router = require('express').Router()
const controller = require('../controllers/user.js')

router.get('/', controller.GET)

module.exports = router