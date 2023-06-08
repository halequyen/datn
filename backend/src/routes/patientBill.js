const express = require('express')
const router = express.Router()

const patientBillController = require('../app/controllers/PatientBillController')

router.delete('/:id', patientBillController.delete)
router.put('/:id', patientBillController.update)
router.post('/', patientBillController.create)
router.get('/', patientBillController.index)

module.exports = router
