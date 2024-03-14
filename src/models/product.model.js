'use strict'
const { Schema, model, Types } = require('mongoose');
const { collection } = require('./keytoken.model');

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

const productSchema = new Schema({
    product_name: {
        type: String,
        required: true
    },
    product_thumb: {
        type: String,
        required: true
    },
    product_price: {
        type: Number,
        required: true
    },
    product_description: {
        type: String,
        required: true
    },
    product_quantity: {
        type: Number,
        required: true
    },
    product_type: {
        type: String,
        required: true,
        enum: ['Electronics', 'Clothing', 'Furniture']
    },
    product_shop: String,
    product_attributes: {
        type: Schema.Types.Mixed,
        required: true
    }
},
  {
    collection: COLLECTION_NAME,
    timestamps: true
  }
)

//define the product type = clothing
