'use strict'

const { product, electronics, clothing, furniture } = require('../../models/product.model')
const { Types } = require('mongoose')
const { getSelectData, getUnSelectData } = require('../../utils')

const searchProducts = async ( keywordSearch ) => {
   const searchRegex = new RegExp(keywordSearch)
   const resultSearch = await product.find({
        isPublished: true,
        $text: { $search: searchRegex }
    },
    {score: {$meta: 'textScore'}}
    )
    .sort({score: {$meta: 'textScore'}})
    .lean()
   return resultSearch
}
const findAllDraftsForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
}

const findAllPublishForShop = async ({ query, limit, skip }) => {
    return await queryProduct({ query, limit, skip })
}

const publishProductByShop = async ({ product_shop, product_id }) => {
    const foundShop = await product.findOne({ 
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id),
     })

    if (!foundShop) return

    foundShop.isDraft = false
    foundShop.isPublished = true
    const { modifiedCount } = await foundShop.updateOne(foundShop)

    return modifiedCount
}

const unPublishProductByShop = async ({ product_shop, product_id }) => {
    const foundShop = await product.findOne({ 
        product_shop: new Types.ObjectId(product_shop),
        _id: new Types.ObjectId(product_id),
     })

    if (!foundShop) return

    foundShop.isDraft = true
    foundShop.isPublished = false
    const { modifiedCount } = await foundShop.updateOne(foundShop)

    return modifiedCount
}

const findAllProducts = async ({ limit, sort, page, filter, select}) => {
    const skip = (page - 1) * limit
    const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }
    const products = await product.find(filter)
    .sort(sortBy)
    .skip(skip)
    .limit(limit)
    // select co dang [ 'product_name', 'product_thumb', 'product_price' ] ==> thay doi thanh { product_name: 1, product_thumb: 1, product_price: 1 }
    .select(getSelectData(select))
    .lean()

    return products
}

const findProductById = async ({ product_id, unSelect }) => {
    return await product.findById(product_id)
    .select(getUnSelectData(unSelect))
}

const updateProductById = async ({ productId, bodyUpdate, model, isNew = true }) => {
    return await model.findByIdAndUpdate(productId, bodyUpdate, { new: isNew })
}

const queryProduct = async ({ query, limit, skip }) => {
    return await product.find(query)
    .populate('product_shop', 'name email -_id')
    .skip(skip)
    .limit(limit)
    .lean()
    .exec()
}



module.exports = {
    findAllDraftsForShop,
    publishProductByShop,
    findAllPublishForShop,
    unPublishProductByShop,
    searchProducts,
    findAllProducts,
    findProductById,
    updateProductById
}