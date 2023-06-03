const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MedicinePrice = new Schema({
    id: { type: String },
    name: { type: String },
    activeSubstance: { type: String },
    unit: { type: String },
    concentration: { type: String },
    quantity: { type: Number },
    price: { type: String },
    type: { type: String,
        enum:['0', '1'] },
})

module.exports = mongoose.model('MedicinePrice', MedicinePrice)
