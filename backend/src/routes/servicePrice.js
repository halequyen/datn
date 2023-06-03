const express = require('express')
const router = express.Router()

const servicePriceController = require('../app/controllers/ServicePriceController')

router.delete('/:id', servicePriceController.delete)
router.put('/:id', servicePriceController.update)
router.post('/', servicePriceController.create)
router.get('/', servicePriceController.index)

module.exports = router