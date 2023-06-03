const Equipment = require('../models/Equipment')

class EquipmentController {
    index(req, res, next) {
        Equipment.find({})
             .then(equipment => res.json(equipment))
             .catch(next)
    }

    create(req, res, next) {
        const equipmentData = req.body;
        Equipment.create(equipmentData)
          .then((equipment) => res.json(equipment))
          .catch(next);
      }
    
      update(req, res, next) {
        const equipmentId = req.params.id;
        const updatedEquipmentData = req.body;
        Equipment.findByIdAndUpdate(equipmentId, updatedEquipmentData, { new: true })
          .then((equipment) => res.json(equipment))
          .catch(next);
      }
    
      delete(req, res, next) {
        const equipmentId = req.params.id;
        console.log(equipmentId);
        Equipment.findByIdAndDelete(equipmentId)
          .then(() => res.json({ message: "Equipment deleted successfully" }))
          .catch(next);
      }
}

module.exports = new EquipmentController
