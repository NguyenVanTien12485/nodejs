'use strict'

const express = require('express');
const ProductController = require('../../controllers/product.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authenticationV2 } = require('../../auth/authUtils');
const router = express.Router();

// authentication
router.use(authenticationV2)    

///
router.post('', asyncHandler(ProductController.createProduct) )


module.exports = router