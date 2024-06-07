const { inventory } = require('../inventory.model')
const { Types } = require('mongoose')
const insertInventory = async ({ 
    productId,
    shopId,
    stock,
    location = 'unknown'
 }) => {
    return await inventory.create({
        inventory_productId: productId,
        inventory_shop: shopId,
        inventory_stock: stock,
        inventory_location: location
    })
}


module.exports = {
    insertInventory
}