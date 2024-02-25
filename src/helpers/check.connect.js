'use strict'

const mongoose = require('mongoose')
const os = require('os')
const process = require('process')
const _SECONDS = 5000

// count connections
const countConnect = () => {
    const numConnection = mongoose.connections.length
    console.log('Number of connections', numConnection);
    return numConnection
}

// check overload
const checkOverLoad = () => {
   setInterval(() => {
    const numConnection = mongoose.connections.length
    const numCores = os.cpus().length
    const memoryUsage = process.memoryUsage().rss
    // Example maximum number of connections bases on number of cores
    console.log('Active connections', numConnection);
    console.log('Memories usage', memoryUsage/1024/1024, 'MB');
    const maxConnection = numCores * 5

    if( numConnection > maxConnection ) {
        console.log('Overload');
        // notify.send()
    }

   }, _SECONDS)  
}
module.exports = {
    countConnect,
    checkOverLoad
}