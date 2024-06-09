'use strict'

const { Schema, model } = require('mongoose');

const DOCUMENT_NAME = 'Discount';
const COLLECTION_NAME = 'discounts';

const discountSchema = new Schema(
    {
      discount_name: {
        type: String,
        required: true
      },
      discount_description: {
        type: String,
        required: true
      },
      discount_type: {
        type: String,
        default: 'fixed_amount' // percentage
      },
      discount_value: {
        type: Number,
        required: true
      },
      discount_code: {
        type: String,
        required: true
      },
      discount_start_date: {
        type: Date,
        required: true
      },
      discount_end_date: {
        type: Date,
        required: true
      },
      discount_max_uses: {
        type: Number,
        required: true
      }, // so luong discount duoc su dung toi da
      discount_uses: {
        type: Number,
        required: true
      }, // moi discount da duoc su dung toi da bao nhieu luot
      discount_users_used: {
        type: Array,
        default: []
      }, // Ai da su dung discount nay
      discount_max_uses_per_user: {
        type: Number,
        required: true
      }, // so luong discount cua 1 user duoc su dung toi da
      discount_min_order_value: {
        type: Number,
        required: true,
      },
      discount_shopId: {
        type: Schema.Types.ObjectId,
        ref: 'Shop'
      },
      discount_is_active: {
        type: Boolean,
        default: true
      },
      discount_applies_to: {
        type: String,
        enum: ['all_products', 'specific_products'],
        required: true
      },
      discount_product_ids: {
        type: Array,
        default: []
      } // so san pham duoc ap dung
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME
    }
)

module.exports = model(DOCUMENT_NAME, discountSchema)