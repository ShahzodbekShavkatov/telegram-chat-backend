const router = require('express').Router()
const controller = require('../controllers/message.js')

router.get('/', controller.GET)
router.post('/', controller.POST)

module.exports = router