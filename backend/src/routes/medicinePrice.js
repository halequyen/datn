const express = require('express')
const router = express.Router()

const medicinePriceController = require('../app/controllers/MedicinePriceController')

router.get('/', medicinePriceController.index)

module.exports = router