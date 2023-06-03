const Information = require("../models/Information");

class InformationController {
  index(req, res, next) {
    Information.find({})
      .then((information) => res.json(information))
      .catch(next);
  }

  update(req, res, next) {
    const informationId = req.params.id;
    const updatedInformationData = req.body;
    Information.findByIdAndUpdate(informationId, updatedInformationData, {
      new: true,
    })
      .then((information) => res.json(information))
      .catch(next);
  }
}

module.exports = new InformationController();
