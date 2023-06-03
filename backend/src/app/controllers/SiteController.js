const Patient = require("../models/Patient");
class SiteController {
  index(req, res, next) {
    Patient.find({})
      .then((patients) => res.json(patients))
      .catch(next);
  }

  create(req, res, next) {
    const patientData = req.body;
    Patient.create(patientData)
      .then((patients) => res.json(patients))
      .catch(next);
  }

  update(req, res, next) {
    const patientId = req.params.id;
    const updatedPatientData = req.body;
    Patient.findByIdAndUpdate(patientId, updatedPatientData, { new: true })
      .then((patients) => res.json(patients))
      .catch(next);
  }

  delete(req, res, next) {
    const patientId = req.params.id;
    console.log(patientId);
    Patient.findByIdAndDelete(patientId)
      .then(() => res.json({ message: "Patient deleted successfully" }))
      .catch(next);
  }
}

module.exports = new SiteController();
