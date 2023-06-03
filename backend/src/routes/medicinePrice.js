const express = require('express')
const router = express.Router()

const medicinePriceController = require('../app/controllers/MedicinePriceController')

router.delete('/:id', medicinePriceController.delete)
router.put('/:id', medicinePriceController.update)
router.post('/', medicinePriceController.create)
router.get('/', medicinePriceController.index)

module.exports = router