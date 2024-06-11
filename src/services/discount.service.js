'use strict'

const {
    BadRequestError,
    NotFoundError
} = require('../core/error.response')

const { convertToObjectIdMongodb } = require('../utils')

const discount = require('../models/discount.model')
const { findAllProducts } = require('../models/repository/product.repo')
const { findAllDiscountCodesUnSelect, 
    findAllDiscountCodesSelect,
    checkDiscountExists
} = require('../models/repository/discount.repo')
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

        // create index for discount code
        const foundDiscount  = await discount.findOne({
            discount_code: code,
            discount_shopId: convertToObjectIdMongodb(shopId),
        }).lean()

        if (foundDiscount && foundDiscount.discount_is_active) {
            throw new BadRequestError('Discount code already exists')
        }

        const newDiscount = await discount.create({
            discount_code: code,
            discount_start_date: start_date,
            discount_end_date: end_date,
            discount_is_active: is_active,
            discount_shopId: convertToObjectIdMongodb(shopId),
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
            discount_shopId: convertToObjectIdMongodb(shopId),
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
                    product_shop: convertToObjectIdMongodb(shopId),
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
               discount_shop: convertToObjectIdMongodb(shopId),
               discount_is_active: true
           },
           unSelect: ['__v', 'discount_shopId'],
           model: discount
        })

        return discounts
    }

    /// Apply discount code
    // products = [
    //     {
    //         productId,
    //         shopId,
    //         quantity,
    //         price,
    //         name
    //     }
    // ]
    static async getDiscountAmount ({ codeId, userId, shopId, products }) {
        const foundDiscount = await checkDiscountExists({
            model: discount,
            filter: {
                discount_code: codeId,
                discount_shopId: convertToObjectIdMongodb(shopId),
                discount_is_active: true
            }
        })

        if (!foundDiscount) {
            throw new NotFoundError('Discount not exists')
        }

        const {
            discount_is_active,
            discount_max_uses,
            discount_min_order_value,
            discount_max_uses_per_user,
            discount_users_used,
            discount_type,
            discount_value,
        } = foundDiscount

        if (!discount_is_active) {
            throw new NotFoundError('Discount code has expired')
        }
        
        if (discount_max_uses <= 0) {
            throw new NotFoundError('Discount are out of uses')
        }

        if (new Date() > new Date(foundDiscount.discount_end_date) || new Date() < new Date(foundDiscount.discount_start_date)) {
            throw new NotFoundError('Discount code has expired')
        }

        // check xem cos et gia tri toi thieu hay khong ?
        let totalOrder = 0
        if( discount_min_order_value > 0 ) {
            // get total 
            totalOrder = products.reduce((total, product) => {
                return total + (product.price * product.quantity)
            }, 0)

            if (totalOrder < discount_min_order_value) {
                throw new NotFoundError('Discount requires a minimum purchase of (vnd)' + discount_min_order_value)
            }
        }

        if ( discount_max_uses_per_user > 0 ) {
            const userUsedDiscount = await discount_users_used.find(
               user => user.userId === userId
            )
            if ( userUsedDiscount) {
                //....
            }
        }

        // check xem discount nay la fix amount hay percentage
        const amount = discount_type === 'fix_amount' ? discount_value : (totalOrder * discount_value) / 100

        return {
            discount: amount,
            total: totalOrder,
            priceAfterDiscount: totalOrder - amount
        }
    }

    /// Delete discount code
    static async deleteDiscountCode ({ codeId, shopId }) {
        const deleted = await discount.findOneAndDelete({
            discount_code: codeId,
            discount_shopId: convertToObjectIdMongodb(shopId)
        })

        return deleted
    }

    /// Cancel discount code
    static async cancelDiscountCode ({ codeId, shopId, userId }) {
       const foundDiscount = await checkDiscountExists({
           model: discount,
           filter: {
               discount_code: codeId,
               discount_shopId: convertToObjectIdMongodb(shopId),
           }
       })

       if (!foundDiscount) {
           throw new NotFoundError('Discount not exists')
       }

       const result = await discount.findByIdAndUpdate(
           foundDiscount._id,
         {
            $pull: {
                discount_users_used: userId
            },
            $inc: {
                    discount_max_uses: 1,
                    discount_max_count: -1
            }
       })

       return result
    }
}

module.exports = DiscountService