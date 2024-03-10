const compression = require('compression');
const express = require('express');
const { default: helmet } = require('helmet');
const morgan = require('morgan');
const app = express();

// init middlewere
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
// init database
require('./dbs/init.mongodb.js')
const { checkOverLoad } = require('./helpers/check.connect.js')
checkOverLoad()
// init routes
app.use('/', require('./routers'))

// handle error
/// middlewere handle error
app.use((req, res, next) => {
    const error = new Error('Not Found')
    error.status = 404
    next(error)
})
/// handle error
app.use((error, req, res, next) => {
    const statusCode = error.status || 500
   return res.status(statusCode).json({
       status: 'error',
       code: statusCode,
       stack: error.stack,
       message: error.message || 'Internal Server Error',
   })
})
module.exports = app