const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Staff = new Schema({
    id: { type: String },
    name: { type: String },
    gender: { type: String },
    dob: { type: String },
    jobTitle: { type: String },
    certificate: { type: String },
    startDate: { type: String },
    endDate: { type: String },
    phone: { type: String },
    state: { type: String,
        enum:['0', '1'] },
    identification: { type: Number },
    email: { type: String },
    nation: { type: String },
    nationality: { type: String },
    city: { type: String },
    district: { type: String },
    address: { type: String }
})

module.exports = mongoose.model('Staff', Staff)
