const express = require('express')
const router = express.Router()

const scheduleController = require('../app/controllers/ScheduleController')

router.get('/', scheduleController.index)

module.exports = router
