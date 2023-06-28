const express = require('express')
const router = express.Router()

const userController = require('../app/controllers/UserController')

router.post('/login', userController.login)
router.post('/refresh', userController.refresh)
router.delete('/:id', userController.delete)
router.put('/:id', userController.update)
router.post('/', userController.create)
router.get('/', userController.index)
router.post('/logout', userController.logout)

module.exports = router
