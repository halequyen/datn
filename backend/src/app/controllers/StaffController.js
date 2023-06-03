const Staff = require("../models/Staff");

class StaffController {
  index(req, res, next) {
    Staff.find({})
      .then((staffs) => res.json(staffs))
      .catch(next);
  }

  create(req, res, next) {
    const staffData = req.body;
    Staff.create(staffData)
      .then((staffs) => res.json(staffs))
      .catch(next);
  }

  update(req, res, next) {
    const staffId = req.params.id;
    const updatedStaffData = req.body;
    Staff.findByIdAndUpdate(staffId, updatedStaffData, { new: true })
      .then((staffs) => res.json(staffs))
      .catch(next);
  }

  delete(req, res, next) {
    const staffId = req.params.id;
    console.log(staffId);
    Staff.findByIdAndDelete(staffId)
      .then(() => res.json({ message: "Staff deleted successfully" }))
      .catch(next);
  }
}

module.exports = new StaffController();
