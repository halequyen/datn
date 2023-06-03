const mongoose = require('mongoose')

async function connect() {
    try {
        mongoose.set("strictQuery", true)
        mongoose.connect('mongodb+srv://halequyen19042001:Sau19042001@datn.crg9aio.mongodb.net/clinic?retryWrites=true&w=majority')
        console.log('Connect sucessfully')
    } catch (error) {
        console.log('Connect failure');
    }
}

module.exports = { connect }