'use strict'
const { Schema, model } = require('mongoose');
const slugify = require('slugify');
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
    product_slug: String,
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
    },
    // More
    product_ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
        // 4.3456666 => 4.3
        set: val => Math.round(val * 10) / 10
    },
    product_variations: {
        type: Array,
        default: []
    },
    isDraft: {
        type: Boolean,
        default: true,
        index: true,
        select: false
    },
    isPublished: {
        type: Boolean,
        default: false,
        index: true,
        select: false
    }
},
  {
    collection: COLLECTION_NAME,
    timestamps: true
  }
)
// create Index for text search
productSchema.index({
    product_name: 'text',
    product_description: 'text'
})
// Document middlewere: runs before .save() and .create(),...
productSchema.pre('save', function (next) {
    this.product_slug = slugify(this.product_name, {
        lower: true
    })
    next()
})

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

const furnitureScheme = new Schema({
    brand: {
        type: String,
        required: true
    },
    size: String,
   meterial: String,
   product_shop: {
       type: Schema.Types.ObjectId,
       ref: 'Shop'
   }
},
    {
        collection: 'furniture',
        timestamps: true
    }
)

module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    clothing: model('Clothing', clothingSchema),
    electronics: model('Electronics', electronicsSchema),
    furniture: model('Furniture', furnitureScheme)
}