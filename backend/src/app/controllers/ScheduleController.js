const Schedule = require('../models/Schedule')

class ScheduleController {
    index(req, res, next) {
        Schedule.find({})
             .then(schedules => res.json(schedules))
             .catch(next)
     }
}

module.exports = new ScheduleController
