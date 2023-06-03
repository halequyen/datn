const MedicinePrice = require('../models/MedicinePrice')

class MedicinePriceController {
    index(req, res, next) {
        MedicinePrice.find({})
             .then(medicineprices => res.json(medicineprices))
             .catch(next)
     }
}

module.exports = new MedicinePriceController
