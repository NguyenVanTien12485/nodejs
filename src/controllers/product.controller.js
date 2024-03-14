'use strict'
const ProductService = require('../services/product.service')
const {OK, CREATED, SuccessResponse} = require('../core/success.response')
class ProductController {
  handleRefreshToken = async (req, res, next) => {
    createProduct = async (req, res, next) => {
        new SuccessResponse(
         {
           message: 'Create new product success',
           metadata: await ProductService.createProduct(req.body.product_type, req.body),
         }
       ).send(res)
    }
  }
}

module.exports = new AccessController()