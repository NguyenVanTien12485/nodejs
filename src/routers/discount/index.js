'use strict'

const express = require('express');
const DiscountController = require('../../controllers/discount.controller');
const asyncHandler = require('../../helpers/asyncHandler');
const { authenticationV2 } = require('../../auth/authUtils');
const router = express.Router();

router.post('/amount', asyncHandler(DiscountController.getDiscountAmount))
router.get('/list_product_codes', asyncHandler(DiscountController.getAllDiscountCodesWithProduct))

// authentication
router.use(authenticationV2)    

///
router.post('', asyncHandler(DiscountController.createDiscountCode))
router.get('', asyncHandler(DiscountController.getAllDiscountCodesByShop))



module.exports = router