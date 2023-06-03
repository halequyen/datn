const express = require('express')
const router = express.Router()

const userController = require('../app/controllers/UserController')

router.delete('/:id', userController.delete)
router.put('/:id', userController.update)
router.post('/', userController.create)
router.get('/', userController.index)

module.exports = router
