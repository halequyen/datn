const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Material = new Schema({
    id: { type: String },
    name: { type: String },
    unit: { type: String },
    quantity: { type: Number },
    price: { type: String },
    type: { type: String,
        enum:['0', '1'] },
})

module.exports = mongoose.model('Material', Material)
