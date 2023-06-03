const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Schedule = new Schema({
    id: { type: String },
    name: { type: String },
    phone: { type: String },
    note: { type: String },
    date: { type: String },
    timeSlot: { type: String,
        enum:['1', '2', '3', '4', '5', '6', '7', '8', '9'] },
})

module.exports = mongoose.model('Schedule', Schedule)
