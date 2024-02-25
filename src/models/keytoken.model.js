'use strict'

const {Schema, model} = require('mongoose')

const DOCUMENT_NAME = 'Key';
const COLLECTION_NAME = 'Keys';
// Declare the Schema of the Mongo model
var keytokenSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Shop'
    },
    publicKey: {
        type: String,
        required: true,

    },
   refreshToken: {
       type: Array,
       default: []
   },
   collection: COLLECTION_NAME,
   timestamps: true
})

module.exports = model(DOCUMENT_NAME, keytokenSchema)