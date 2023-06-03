const scheduleRouter = require('./schedule')
const informationRouter = require('./information')
const userRouter = require('./user')
const staffRouter = require('./staff')
const materialRouter = require('./material')
const equipmentRouter = require('./equipment')
const servicePriceRouter = require('./servicePrice')
const medicinePriceRouter = require('./medicinePrice')
const siteRouter = require('./site')
function route(app) {
    app.use('/schedule', scheduleRouter)
    app.use('/information', informationRouter)
    app.use('/user', userRouter)
    app.use('/staff', staffRouter)
    app.use('/material', materialRouter)
    app.use('/equipment', equipmentRouter)
    app.use('/service_price', servicePriceRouter)
    app.use('/medicine_price', medicinePriceRouter)

    app.use('/', siteRouter)

}

module.exports = route