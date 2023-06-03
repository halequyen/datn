const express = require('express')
const router = express.Router()

const equipmentController = require('../app/controllers/EquipmentController')

router.get('/', equipmentController.index)

module.exports = router
