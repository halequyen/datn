const express = require('express')
const router = express.Router()

const staffController = require('../app/controllers/StaffController')

router.get('/', staffController.index)

module.exports = router
