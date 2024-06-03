'use strict'

const express = require('express');
const ProductController = require('../../controllers/product.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authenticationV2 } = require('../../auth/authUtils');
const router = express.Router();

// search products
router.get('/search/:keywordSearch', asyncHandler(ProductController.getListSearchProducts) )
router.get('', asyncHandler(ProductController.getAllProducts))
router.get('/:product_id', asyncHandler(ProductController.getProductById))

// authentication
router.use(authenticationV2)    

///
router.post('', asyncHandler(ProductController.createProduct))
router.patch('/:productId', asyncHandler(ProductController.updateProduct))
router.post('/publish/:id', asyncHandler(ProductController.publishProductByShop))
router.post('/unpublish/:id', asyncHandler(ProductController.unPublishProductByShop))

// Query //
router.get('/drafts/all', asyncHandler(ProductController.getAllDraftsShop) )
router.get('/published/all', asyncHandler(ProductController.getAllPublishedShop) )



module.exports = router