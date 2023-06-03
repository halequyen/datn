const Staff = require('../models/Staff')

class StaffController {
    index(req, res, next) {
        Staff.find({})
             .then(staffs => res.json(staffs))
             .catch(next)
     }
}

module.exports = new StaffController
