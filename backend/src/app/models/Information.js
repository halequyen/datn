const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Information = new Schema({
    id: { type: String },
    agency: { type: String },
    own: { type: String },
    hotline: { type: String },
    address: { type: String },
    email: { type: String },
    fanpage: { type: String },
    website: { type: String },
})

module.exports = mongoose.model('Information', Information)
