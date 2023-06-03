const express = require('express')
const router = express.Router()

const equipmentController = require('../app/controllers/EquipmentController')

router.delete('/:id', equipmentController.delete)
router.put('/:id', equipmentController.update)
router.post('/', equipmentController.create)
router.get('/', equipmentController.index)

module.exports = router
