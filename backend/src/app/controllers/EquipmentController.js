const Equipment = require('../models/Equipment')

class EquipmentController {
    index(req, res, next) {
        Equipment.find({})
             .then(equipment => res.json(equipment))
             .catch(next)
     }
}

module.exports = new EquipmentController
