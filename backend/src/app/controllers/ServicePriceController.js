const ServicePrice = require("../models/ServicePrice");

class ServicePriceController {
  index(req, res, next) {
    ServicePrice.find({})
      .then((serviceprices) => res.json(serviceprices))
      .catch(next);
  }

  create(req, res, next) {
    const servicepriceData = req.body;
    ServicePrice.create(servicepriceData)
      .then((serviceprices) => res.json(serviceprices))
      .catch(next);
  }

  update(req, res, next) {
    const servicepriceId = req.params.id;
    const updatedServicePriceData = req.body;
    ServicePrice.findByIdAndUpdate(servicepriceId, updatedServicePriceData, {
      new: true,
    })
      .then((serviceprices) => res.json(serviceprices))
      .catch(next);
  }

  delete(req, res, next) {
    const servicepriceId = req.params.id;
    console.log(servicepriceId);
    ServicePrice.findByIdAndDelete(servicepriceId)
      .then(() => res.json({ message: "ServicePrice deleted successfully" }))
      .catch(next);
  }
}

module.exports = new ServicePriceController();
