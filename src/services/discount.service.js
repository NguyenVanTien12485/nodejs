'use strict'

const {
    BadRequestError,
    NotFoundError
} = require('../core/error.response')

const { convertToObjectIdMongoodb } = require('../utils')

const discount = require('../models/discount.model')
const { findAllProducts } = require('../models/repository/product.repo')
const { findAllDiscountCodesUnSelect, findAllDiscountCodesSelect } = require('../models/repository/discount.repo')
/*
    Discount Service
    1 - Generate discount code [Shop | Admin]
    2 - Get discount amount [User]
    3 - Get all discount codes [User | Shop]
    4 - Verify discount code [User]
    5 - Delete discount code [Shop | Admin]
    6 - Cancel discount code [User]
*/

class DiscountService {
    static async createDiscountCode (payload) {
        const {
            code,
            start_date,
            end_date,
            is_active,
            shopId,
            min_order_value,
            product_ids,
            applies_to,
            name,
            description,
            type,
            value,
            max_value,
            max_uses,
            uses_count,
            max_uses_per_user
        } = payload
        // kiem tra
        if (new Date() < new Date(start_date) || new Date() > new Date(end_date)) {
            throw new BadRequestError('Discount code has expired')
        }

        if (new Date(start_date) > new Date(end_date)) {
            throw new BadRequestError('Start date cannot be greater than end date')
        }

        // create index for discout code
        const foundDiscount  = await discount.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongoodb(shopId),
        }).lean()

        if (foundDiscount && foundDiscount.discount_is_active) {
            throw new BadRequestError('Discount code already exists')
        }

        const newDiscount = await discount.create({
            discount_code: code,
            discount_start_date: start_date,
            discount_end_date: end_date,
            discount_is_active: is_active,
            discount_shopId: convertToObjectIdMongoodb(shopId),
            discount_min_order_value: min_order_value || 0,
            discount_product_ids: applies_to === 'all_products' ? [] : product_ids,
            discount_applies_to: applies_to,
            discount_name: name,
            discount_description: description,
            discount_type: type,
            discount_value: value,
            discount_max_value: max_value,
            discount_max_uses: max_uses,
            discount_uses_count: uses_count,
            discount_max_uses_per_user: max_uses_per_user
        })

        return newDiscount
    }

    static async updateDiscountCode (payload) {
        ///...
    }

    // Get all discount codes
    static async getAllDiscountCodesWithProduct ({
        code, shopId, userId, limit, page
    }) {
        // create index for discount_code
        const foundDiscount  = await discount.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongoodb(shopId),
        }).lean()

        if (!foundDiscount || !foundDiscount.discount_is_active) {
            throw new NotFoundError('Discount not exists')
        }

        const { discount_applies_to, discount_product_ids } = foundDiscount
        let products
        if (discount_applies_to === 'all_products') {
            // get all products
            products = await findAllProducts({
                filter: {
                    product_shop: convertToObjectIdMongoodb(shopId),
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }

        if (discount_applies_to === 'specific_products') {
            // get specific products ids
            products = await findAllProducts({
                filter: {
                    _id: {
                        $in: discount_product_ids
                    },
                    isPublished: true
                },
                limit: +limit,
                page: +page,
                sort: 'ctime',
                select: ['product_name']
            })
        }

        return products
    }

    // Get all discount code of shop
    static async getAllDiscountCodesByShop ({ limit, page, shopId }) {
       const discounts = await findAllDiscountCodesUnSelect({
           limit: +limit,
           page: +page,
           filter: {
               discount_shop: convertToObjectIdMongoodb(shopId),
               discount_is_active: true
           },
           unSelect: ['__v', 'discount_shopId'],
           model: discount
        })

        return discounts
    }
}