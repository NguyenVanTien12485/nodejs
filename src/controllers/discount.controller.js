"use strict";
const DiscountService = require("../services/discount.service");
const { OK, CREATED, SuccessResponse } = require("../core/success.response");

class DiscountController {
    createDiscountCode = async (req, res, next) => {
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

    getAllDiscountCodesWithProduct = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get all discount codes success',
            metadata: await DiscountService.getAllDiscountCodesWithProduct(
                {
                    ...req.query,
                }
            )
        }).send(res)
    }

    getAllDiscountCodesByShop = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get all discount codes success',
            metadata: await DiscountService.getAllDiscountCodesByShop(
                {
                    ...req.query,
                    shopId: req.user.userId
                }
            )
        }).send(res)
    }

    getDiscountAmount = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get discount amount success',
            metadata: await DiscountService.getDiscountAmount(
                {
                    ...req.body,
                }
            )
        }).send(res)
    }
}

module.exports = new DiscountController()