'use strict'

const { product, electronics, clothing, furniture } = require('../../models/product.model')

const findAllDraftsForShop = async ({ query, limit, skip }) => {
    return await product.find(query)
        .populate('product_shop', 'name email -_id')
        .skip(skip)
        .limit(limit)
        .lean()
        .exec()
}

module.exports = {
    findAllDraftsForShop
}