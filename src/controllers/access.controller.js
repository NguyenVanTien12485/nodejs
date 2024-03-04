'use strict'
const AccessService = require('../services/access.service')
const {OK, CREATED, SuccessResponse} = require('../core/success.response')
class AccessController {
    login = async (req, res, next) => {
      new SuccessResponse(
        {
          metadata: await AccessService.login(req.body),
        }
      ).send(res)
    }
   signUp = async (req, res, next) => {
      // return res.status(200).json({
      //    message: 'success',
      //    metadata: 
      // })
      new CREATED(
        {
          message: 'Register OK',
          metadata: await AccessService.signUp(req.body)
        }
      ).send(res)
   }
}

module.exports = new AccessController()