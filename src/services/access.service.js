'use strict'

const shopModel = require('../models/shop.model')
const bcrypt = require('bcrypt')
const crypto = require('node:crypto')
const { getInfoData } = require('../utils')

const KeyTokenService = require('../services/keyToken.service')
const { createTokenPair } = require('../auth/authUtils')

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
}

class AccessService {
    static signUp = async ({name, email, password}) => {
        try {
            // step 1: check email exist ?
            const hodelShop = await shopModel.findOne({email}).lean()
            if(hodelShop) {
                return {
                    code: 'xxx',
                    message: 'Shop already register',
                    status: 'error'
                }
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
        } catch (error) {
            return {
                code: 'xxx',
                message: error.message,
                status: 'error'
            }
        }
    }
}

module.exports = AccessService