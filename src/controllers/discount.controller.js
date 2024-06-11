"use strict";
const DiscountService = require("../services/discount.service");
const { OK, CREATED, SuccessResponse } = require("../core/success.response");

class DiscountController {
    createDiscount = async (req, res) => {
       new SuccessResponse({
        message: 'create discount success',
        metadata: await DiscountService.createDiscountCode(
            {
                ...req.body,
                shopId: req.user.userId
            }
        )
       }).send(res)
    }

    getAllDiscountCodesWithProduct = async (req, res) => {
        new SuccessResponse({
            message: 'Get all discount codes success',
            metadata: await DiscountService.getAllDiscountCodesWithProduct(
                {
                    ...req.body,
                    shopId: req.user.userId
                }
            )
        }).send(res)
    }

    getAllDiscountCodesByShop = async (req, res) => {
        new SuccessResponse({
            message: 'Get all discount codes success',
            metadata: await DiscountService.getAllDiscountCodesByShop(
                {
                    ...req.body,
                    shopId: req.user.userId
                }
            )
        }).send(res)
    }
}

module.exports = new DiscountController()