const express = require('express')
const router = express.Router()

const materialController = require('../app/controllers/MaterialController')

router.get('/', materialController.index)

module.exports = router
