'use strict'
const JWT = require('jsonwebtoken')
const createTokenPair = async ( payload, publicKey, privateKey ) => {
    try {
        // accessToken 
        const accessToken = await JWT.sign(payload, publicKey, {
            // algorithm: 'RS256',
            expiresIn: '2 days',
        })

        const refreshToken = await JWT.sign(payload, privateKey, {
            // algorithm: 'RS256',
            expiresIn: '7 days',
        })

        // verify 
        JWT.verify( accessToken, publicKey, (err, decode) => {
            if(err) throw new Error('err verify:', err);
            console.log('decode verify:', decode);
        })
        return {
            accessToken,
            refreshToken
        }
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    createTokenPair
}