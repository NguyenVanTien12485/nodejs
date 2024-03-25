'use strict'
const { Schema, model } = require('mongoose');

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
    product_shop: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
    },
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
const clothingSchema = new Schema({
    brand: {
        type: String,
        required: true
    },
    size: {
        type: String,
    },
   meterial: {
       type: String,
   }
},
    {
        collection: 'clothes',
        timestamps: true
    }
)

//define the product type = electronic
const electronicsSchema = new Schema({
    manufacturer: {
        type: String,
        required: true
    },
    model: {
        type: String,
    },
   color: {
       type: String,
   },
   product_shop: {
       type: Schema.Types.ObjectId,
       ref: 'Shop'
   }
},
    {
        collection: 'electronics',
        timestamps: true
    }
)

module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    clothing: model('Clothing', clothingSchema),
    electronics: model('Electronics', electronicsSchema)
}