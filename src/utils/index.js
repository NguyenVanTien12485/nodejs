'use strict'

const _ = require('lodash')
const { Types } = require('mongoose')

const convertToObjectIdMongodb = id => {
    return Types.ObjectId(id)
}
const getInfoData = ({ fields = [], object = {}} ) => {
    return _.pick(object, fields)
}

const getSelectData = ( select= [] ) => {
    return Object.fromEntries(select.map( item => [item, 1] ))
}

const getUnSelectData = ( select= [] ) => {
    return Object.fromEntries(select.map( item => [item, 0] ))
}
// if key is undefined, delete key
const removeUndefinedObject = obj => {
    const result = {};

    Object.keys(obj).forEach((k) => {
      const current = obj[k];
  
      if ([null, undefined].includes(current)) return;
      if (Array.isArray(current)) return;
  
      if (typeof current === "object") {
        result[k] = removeUndefinedNullObject(current);
        return;
      }
  
      result[k] = current;
    });
  
    return result;
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

/// Có thể sử dụng lodash để xử lý
/* 
    import _ from 'lodash'
    
    const updateNestedObject = ({ target, updateFields }) => {
    for (let key in target) {
        if (_.isPlainObject(target[key])) {
        // plain object is object which is created from Object or {}
        target[key] = updateNestedObject({ target: target[key], updateFields: updateFields[key] })
        } else if (key in updateFields) {
        target[key] = updateFields[key]
        }
    }
    return target
    }
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
    updateNestedObjectParse,
    convertToObjectIdMongodb
}