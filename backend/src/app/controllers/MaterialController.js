const Material = require("../models/Material");

class MaterialController {
  index(req, res, next) {
    Material.find({})
      .then((materials) => res.json(materials))
      .catch(next);
  }

  create(req, res, next) {
    const materialData = req.body;
    Material.create(materialData)
      .then((materials) => res.json(materials))
      .catch(next);
  }

  update(req, res, next) {
    const materialId = req.params.id;
    const updatedMaterialData = req.body;
    Material.findByIdAndUpdate(materialId, updatedMaterialData, { new: true })
      .then((materials) => res.json(materials))
      .catch(next);
  }

  delete(req, res, next) {
    const materialId = req.params.id;
    console.log(materialId);
    Material.findByIdAndDelete(materialId)
      .then(() => res.json({ message: "Material deleted successfully" }))
      .catch(next);
  }
}

module.exports = new MaterialController();
