const User = require("../models/User");

class UserController {
  index(req, res, next) {
    User.find({})
      .then((users) => res.json(users))
      .catch(next);
  }

  create(req, res, next) {
    const userData = req.body;
    User.create(userData)
      .then((users) => res.json(users))
      .catch(next);
  }

  update(req, res, next) {
    const userId = req.params.id;
    const updatedUserData = req.body;
    User.findByIdAndUpdate(userId, updatedUserData, { new: true })
      .then((users) => res.json(users))
      .catch(next);
  }

  delete(req, res, next) {
    const userId = req.params.id;
    console.log(userId);
    User.findByIdAndDelete(userId)
      .then(() => res.json({ message: "User deleted successfully" }))
      .catch(next);
  }
}

module.exports = new UserController();
