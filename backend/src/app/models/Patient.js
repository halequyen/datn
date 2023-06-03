const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Patient = new Schema({
    _id: { type: String },
    patientCode: { type: String },
    name: { type: String },
    gender: { type: String },
    dob: { type: String },
    phone: { type: String },
    checkDate: { type: String },
    type: { type: String,
        enum:['0', '1'] },
    doctor: { type: String },
    state: { type: String,
    enum:['0', '1'] },
    expense: { type: Number },
    room: { type: String },
    job: { type: String },
    identification: { type: Number },
    email: { type: String },
    nation: { type: String },
    nationality: { type: String },
    city: { type: String },
    district: { type: String },
    address: { type: String }
})

module.exports = mongoose.model('Patient', Patient)
