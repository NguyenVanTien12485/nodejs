'use strict'

const mongoose = require('mongoose');
const { countConnect } = require('../helpers/check.connect')
const { db: { host, port, name } } = require('../configs/config.mongodb.js')

const connectString = `mongodb://${host}:${port}/${name}`;
class Database {
    constructor () {
        this.connect()
    }

    // connect  
    connect(type = 'mongodb') {
        //dev
        if(1===1) {
            mongoose.set('debug', true)
            mongoose.set('debug', {color: true})
        }
        mongoose.connect(connectString).then(_ => console.log('Connected Mongodb succsessfully', countConnect())).catch(err => console.log(err))
    }

    static getInstance() {
        // singleton pattern
        if(!Database.instance) {
            Database.instance = new Database()
        }
        return Database.instance
    }
}

const instanceMongodb = Database.getInstance()

module.exports = instanceMongodb