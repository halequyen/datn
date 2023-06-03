const express = require('express')
const router = express.Router()

const scheduleController = require('../app/controllers/ScheduleController')

router.delete('/:id', scheduleController.delete)
router.put('/:id', scheduleController.update)
router.post('/', scheduleController.create)
router.get('/', scheduleController.index)

module.exports = router
