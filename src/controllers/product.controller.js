"use strict";
const ProductService = require("../services/product.service");
const ProductServiceV2 = require("../services/product.service.xxx");
const { OK, CREATED, SuccessResponse } = require("../core/success.response");
class ProductController {
    createProduct = async (req, res, next) => {
        new SuccessResponse({
            message: "Create new product success",
            metadata: await ProductServiceV2.createProduct(
                req.body.product_type,
                {
                    ...req.body,
                    product_shop: req.user.userId,
                }
            ),
        }).send(res);
    };

    // Query //
    /**
    * 
    * @desc Get all drafts for shop
    * @param {Number} limit 
    * @param {Number} skip
    * @returns {JSON} 
    */
    getAllDraftsShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Get all drafts success",
            metadata: await ProductServiceV2.findAllDraftsShop(
                {
                    product_shop: req.user.userId,
                }
            ),
        }).send(res);
    }
    // End Query //
}

module.exports = new ProductController();
