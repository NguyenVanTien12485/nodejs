'use strict'

const shopModel = require('../models/shop.model')
const bcrypt = require('bcrypt')
const crypto = require('node:crypto')
const { getInfoData } = require('../utils')

const KeyTokenService = require('../services/keyToken.service')
const { createTokenPair } = require('../auth/authUtils')
const { BadRequestError, AuthFailureError } = require('../core/error.response')

// service
const { findByEmail } = require('./shop.service')

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {
      /*
    1- check email in dbs
    2 - match password
    3 - create Access Token and Refresh Token and save
    4 - generate token
    5 - get data return login
  */
  static login = async ({ email, password, refreshToken = null}) => {
    // 1
    const foundShop = await findByEmail({email})
    if(!foundShop) {
        throw new BadRequestError('Error: shop not found')
    }

    // 2
    const match = await bcrypt.compare(password, foundShop.password)
    if(!match) {
        throw new AuthFailureError('Error: Authentication failed')
    }

    //  3 create privateKey and publicKey
    const privateKey = crypto.randomBytes(64).toString('hex')
    const publicKey = crypto.randomBytes(64).toString('hex')

    // 4 generate token
    const { _id: userId } = foundShop 
    const tokens = await createTokenPair({ userId, email }, publicKey, privateKey )

    await KeyTokenService.createKeyToken({
        refreshToken: tokens.refreshToken,
        privateKey,
        publicKey,
        userId
    })
    return {
        shop: getInfoData({
            fileds: ['_id', 'name', 'email'],
            object: foundShop
        }),
        tokens
    }
    
  }
    static signUp = async ({name, email, password}) => {
        // try {
            // step 1: check email exist ?
            const hodelShop = await shopModel.findOne({email}).lean()
            if(hodelShop) {
                throw new BadRequestError('Error: shop already exist')
            }

            const passwordHash = await bcrypt.hash(password, 10)

            const newShop = await shopModel.create({
                name, email, password: passwordHash, roles: [RoleShop.SHOP]
            })
            if (newShop) {
                // create privateKey and publicKey
                // privateKey: SIGN token
                // publicKey: VERIFY token

                /* Version difficult */
                // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
                //     modulusLength: 4096,
                //     publicKeyEncoding: {
                //         type: 'pkcs1',
                //         format: 'pem'
                //     },
                //     privateKeyEncoding: {
                //         type: 'pkcs1',
                //         format: 'pem'
                //     }
                // })
                // const publicKeyString = await KeyTokenService.createKeyToken({
                //     userId: newShop._id,
                //     publicKey
                // })
                 // if (!publicKeyString) {
                //     return {
                //         code: 'xxx',
                //         message: 'Error',
                //     }
                // }
                // const publicKeyObject = crypto.createPublicKey(publicKeyString)
                // const tokens = await createTokenPair({ userId: newShop._id, email }, publicKeyObject, privateKey )

                /* Version easy */
                const privateKey = crypto.randomBytes(64).toString('hex')
                const publicKey = crypto.randomBytes(64).toString('hex')

                console.log('privateKey', privateKey)
                console.log('publicKey', publicKey)
                const keyStore = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey
                })

                if (!keyStore) {
                    // throw new BadRequestError('Error: create key token error')
                    return {
                        code: 'xxx',
                        message: 'Error',
                    }
                }


                // create token pair
                const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey )
                console.log('Create token success', tokens);
                console.log('getInfo', getInfoData({ fileds: ['_id', 'name', 'email'], object: newShop}));
                 return {
                    code: 201,
                    metadata: {
                        shop: getInfoData({ fileds: ['_id', 'name', 'email'], object: newShop}),
                        tokens
                    }
                 }
            }
            return {
                code: 200,
                metadata: null
            }
        // } catch (error) {
            // return {
            //     code: 'xxx',
            //     message: error.message,
            //     status: 'error'
            // }
        // }
    }
}

module.exports = AccessService