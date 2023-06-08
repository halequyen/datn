const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PatientBill = new Schema({
    id: { type: String },
    name: { type: String },
    quantity: { type: String },
    price: { type: String },
    patientId: { type: String },
    date: { type: String },
    
})

module.exports = mongoose.model('PatientBill', PatientBill)
