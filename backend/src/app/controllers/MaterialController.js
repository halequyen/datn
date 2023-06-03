const Material = require('../models/Material')

class MaterialController {
    index(req, res, next) {
        Material.find({})
             .then(materials => res.json(materials))
             .catch(next)
     }
}

module.exports = new MaterialController
