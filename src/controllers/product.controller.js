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

    // Update Product
    updateProduct = async (req, res, next) => {
        console.log('req.body.product_type', req);
        new SuccessResponse({
            message: "Update product success",
            metadata: await ProductServiceV2.updateProduct(
                req.body.product_type,
                req.params.productId,
               {
                ...req.body,
                product_shop: req.user.userId,
               }
            ),
        }).send(res);
    };

    getListSearchProducts = async (req, res, next) => {
        new SuccessResponse({
            message: "Search product success",
            metadata: await ProductServiceV2.handleSearchProducts(
                req.params
            ),
        }).send(res);
    };

    publishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Publish product success",
            metadata: await ProductServiceV2.publishProductShop(
                {
                    product_id: req.params.id,
                    product_shop: req.user.userId,
                }
            ),
        }).send(res);
    };

    unPublishProductByShop = async (req, res, next) => {
        new SuccessResponse({
            message: "unPublish product success",
            metadata: await ProductServiceV2.unPublishProductShop(
                {
                    product_id: req.params.id,
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

    getAllPublishedShop = async (req, res, next) => {
        new SuccessResponse({
            message: "Get all published success",
            metadata: await ProductServiceV2.findAllPublishShop(
                {
                    product_shop: req.user.userId,
                }
            ),
        }).send(res);
    }

    getAllProducts = async (req, res, next) => {
        new SuccessResponse({
            message: "Get all products success",
            metadata: await ProductServiceV2.findAllProducts(
                req.query
            ),
        }).send(res);
    }
    
    getProductById = async (req, res, next) => {
        new SuccessResponse({
            message: "Get product by ID success",
            metadata: await ProductServiceV2.findProductById(
               {
                product_id: req.params.product_id
               }
            ),
        }).send(res);
    }
}

module.exports = new ProductController();
