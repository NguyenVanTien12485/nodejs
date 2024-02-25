const compression = require('compression');
const express = require('express');
const { default: helmet } = require('helmet');
const morgan = require('morgan');
const app = express();

// init middlewere
app.use(morgan("dev"))
app.use(helmet())
app.use(compression())
// init database
require('./dbs/init.mongodb.js')
const { checkOverLoad } = require('./helpers/check.connect.js')
checkOverLoad()
// init routes
app.use('/', require('./routers'))
// handle error

module.exports = app