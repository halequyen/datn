const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema({
    id: { type: String },
    userName: { type: String },
    password: { type: String },
    owner: { type: String },
    type: { type: String,
        enum:['0', '1'] },
    
})

module.exports = mongoose.model('User', User)
