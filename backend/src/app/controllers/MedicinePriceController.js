const MedicinePrice = require("../models/MedicinePrice");

class MedicinePriceController {
  index(req, res, next) {
    MedicinePrice.find({})
      .then((medicineprices) => res.json(medicineprices))
      .catch(next);
  }

  create(req, res, next) {
    const medicinepriceData = req.body;
    MedicinePrice.create(medicinepriceData)
      .then((medicineprices) => res.json(medicineprices))
      .catch(next);
  }

  update(req, res, next) {
    const medicinepriceId = req.params.id;
    const updatedMedicinePriceData = req.body;
    MedicinePrice.findByIdAndUpdate(medicinepriceId, updatedMedicinePriceData, {
      new: true,
    })
      .then((medicineprices) => res.json(medicineprices))
      .catch(next);
  }

  delete(req, res, next) {
    const medicinepriceId = req.params.id;
    console.log(medicinepriceId);
    MedicinePrice.findByIdAndDelete(medicinepriceId)
      .then(() => res.json({ message: "MedicinePrice deleted successfully" }))
      .catch(next);
  }
}

module.exports = new MedicinePriceController();
