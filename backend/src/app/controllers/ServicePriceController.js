const ServicePrice = require('../models/ServicePrice')

class ServicePriceController {
    index(req, res, next) {
        ServicePrice.find({})
             .then(serviceprices => res.json(serviceprices))
             .catch(next)
     }
}

module.exports = new ServicePriceController
