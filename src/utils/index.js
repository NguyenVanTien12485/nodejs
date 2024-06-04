'use strict'

const _ = require('lodash')

const getInfoData = ({ fileds = [], object = {}} ) => {
    return _.pick(object, fileds)
}

const getSelectData = ( select= [] ) => {
    return Object.fromEntries(select.map( item => [item, 1] ))
}

const getUnSelectData = ( select= [] ) => {
    return Object.fromEntries(select.map( item => [item, 0] ))
}
// if key is undefined, delete key
const removeUndefinedObject = obj => {
    Object.keys(obj).forEach(key => obj[key] === null && delete obj[key])
    return obj
}

/*
    const obj = {
        a: {
            b: {
                c: 1
            }
        }
    }

    db.collection.updateOne({
        `a.b.c`: 1
    })

    { 'a.b.c': 1 }
*/
const updateNestedObjectParse = obj => {
    const final = {}
    Object.keys(obj).forEach(key => {
        if ( typeof obj[key] === 'object' && !Array.isArray(obj[key]) ) {
            const response = updateNestedObjectParse(obj[key])
            Object.keys(response).forEach(keyNested => {
                final[`${key}.${keyNested}`] = response[keyNested]
            })
        } else {
            final[key] = obj[key]
        }
    })

    return final
}

module.exports = {
    getInfoData,
    getSelectData,
    getUnSelectData,
    removeUndefinedObject,
    updateNestedObjectParse
}