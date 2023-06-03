const Schedule = require("../models/Schedule");

class ScheduleController {
  index(req, res, next) {
    Schedule.find({})
      .then((schedules) => res.json(schedules))
      .catch(next);
  }

  create(req, res, next) {
    const scheduleData = req.body;
    Schedule.create(scheduleData)
      .then((schedules) => res.json(schedules))
      .catch(next);
  }

  update(req, res, next) {
    const scheduleId = req.params.id;
    const updatedScheduleData = req.body;
    Schedule.findByIdAndUpdate(scheduleId, updatedScheduleData, { new: true })
      .then((schedules) => res.json(schedules))
      .catch(next);
  }

  delete(req, res, next) {
    const scheduleId = req.params.id;
    console.log(scheduleId);
    Schedule.findByIdAndDelete(scheduleId)
      .then(() => res.json({ message: "Schedule deleted successfully" }))
      .catch(next);
  }
}

module.exports = new ScheduleController();
