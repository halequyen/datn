const Information = require('../models/Information')

class InformationController {
    index(req, res, next) {
        Information.find({})
             .then(information => res.json(information))
             .catch(next)
     }
}

module.exports = new InformationController
