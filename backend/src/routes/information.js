const express = require('express')
const router = express.Router()

const informationController = require('../app/controllers/InformationController')

router.put('/:id', informationController.update)
router.get('/', informationController.index)

module.exports = router
