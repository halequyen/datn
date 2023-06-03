const express = require('express')
const router = express.Router()

const materialController = require('../app/controllers/MaterialController')

router.delete('/:id', materialController.delete)
router.put('/:id', materialController.update)
router.post('/', materialController.create)
router.get('/', materialController.index)

module.exports = router
