'use strict'
const { Schema, model, Types } = require('mongoose');

const DOCUMENT_NAME = 'Inventory';
const COLLECTION_NAME = 'Inventories';

// Declare the Schema of the Mongo model
const  inventorySchema = new Schema({
    inventory_productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product'
    },
    inventory_location: {
        type: String,
        default: 'unknown'
    },
    inventory_stock: {
        type: Number,
        required: true
    },
    inventory_shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    },
    inventory_reservations: {
        type: Array,
        default: []
    }
    /*
        cartId,
        stock: 1,
        createdOn:
    */
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
});

//Export the model
module.exports = model(DOCUMENT_NAME, inventorySchema);