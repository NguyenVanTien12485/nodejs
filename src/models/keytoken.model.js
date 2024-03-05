'use strict';
const { Schema, model } = require('mongoose');


const DOCUMENT_NAME = 'Key';
const COLLECTION_NAME = 'Keys';
// Declare the Schema of the Mongo model
const keyTokenSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Shop'
    },
    publicKey: {
      type: String,
      required: true
    },
    privateKey: {
      type: String,
      required: true
    },
    refreshTokenUsed: {
      type: Array,
      default: [] // nhung refresh token da duoc su dung
    },
    refreshToken: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
);

module.exports = model(DOCUMENT_NAME, keyTokenSchema);
