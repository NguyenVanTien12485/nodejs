'use strict'

const keytokenModel = require("../models/keytoken.model")
// const keyTokenSchema = require("../models/keytoken.model")
const { Types } = require('mongoose')
class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }) => {
        try {
            // level 0
            // const tokens = await keyTokenSchema.create({
            //     user: userId,
            //     publicKey,
            //     privateKey
            // })

            // return tokens ? tokens.publicKey : null

            // level xxx
            const filter = { user: userId },
                update = { publicKey, privateKey, refreshTokenUsed: [], refreshToken },
                option = { upsert: true, new: true }
            const tokens = await keytokenModel.findOneAndUpdate(
                filter, update, option
            )
            return tokens ? tokens.publicKey : null
        } catch (error) {
            return error
        }
    }

    static  findByUserId = async (userId) => {
        return await keytokenModel.findOne({ user: new Types.ObjectId(userId) }).lean()
    }

    static removeKeyById = async (id) => {
        return await keytokenModel.deleteOne()
    }
}

module.exports = KeyTokenService