const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ServicePrice = new Schema({
    id: { type: String },
    name: { type: String },
    price: { type: String },
    description: { type: String },
    type: { type: String,
        enum:['0', '1'] },  
})



module.exports = mongoose.model('ServicePrice', ServicePrice)
