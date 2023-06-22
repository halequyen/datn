const express = require('express')
const router = express.Router()

const staffController = require('../app/controllers/StaffController')

router.delete('/:id', staffController.delete)
router.put('/:id', staffController.update)
router.post('/', staffController.create) 
router.get('/', staffController.index)

module.exports = router
