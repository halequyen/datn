const PatientBill = require("../models/PatientBill");
class SiteController {
  index(req, res, next) {
    PatientBill.find({})
      .then((patientbills) => res.json(patientbills))
      .catch(next);
  }

  create(req, res, next) {
    const patientBillData = req.body;
    PatientBill.create(patientBillData)
      .then((patientbills) => res.json(patientbills))
      .catch(next);
  }

  update(req, res, next) {
    const patientBillId = req.params.id;
    const updatedPatientBillData = req.body;
    PatientBill.findByIdAndUpdate(patientBillId, updatedPatientBillData, { new: true })
      .then((patientbills) => res.json(patientbills))
      .catch(next);
  }

  delete(req, res, next) {
    const patientBillId = req.params.id;
    console.log(patientBillId);
    PatientBill.findByIdAndDelete(patientBillId)
      .then(() => res.json({ message: "Patient bill deleted successfully" }))
      .catch(next);
  }
}

module.exports = new SiteController();
