const express = require('express')
const router = express.Router()

const servicePriceController = require('../app/controllers/ServicePriceController')

router.get('/', servicePriceController.index)

module.exports = router