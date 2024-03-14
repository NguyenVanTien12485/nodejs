'use strict'

const { product, clothing, electronics } = require('../models/product.model')
const {BadRequestError} = require('../core/error.response')
// define Factory class to create product
class ProdcutFactory {
    /*
        type: 'Clothing',
        payload
    */
    static async createProduct(type, payload) {
        switch (type) {
            case 'Electronics':
                return new Electronics(payload)
            case 'Clothing':
                return new Clothing(payload).createProduct()
            default:
                throw new BadRequestError(`invalid product type ${type}`)
        }
    }
}

// define base product class
class Product {
    constructor({
        product_name,
        product_thumb,
        product_price,
        product_description,
        product_quantity,
        product_type,
        product_shop,
        product_attributes
    }) {
        this.product_name = product_name
        this.product_thumb = product_thumb
        this.product_price = product_price
        this.product_description = product_description
        this.product_quantity = product_quantity
        this.product_type = product_type
        this.product_shop = product_shop
        this.product_attributes = product_attributes
    }

    // create product
    async createProduct() {
        return await product.create(this)
    }
}

// Define sub-class for different product types Clothing
class Clothing extends Product {
  async createProduct() {
      const newClothing = await clothing.create(this.product_attributes)
      if (!newClothing) throw new BadRequestError('create new clothing failed')

      const newProduct = await super.createProduct()
      if(!newProduct) throw new BadRequestError('create new product failed')

      return newProduct
  }
}

// Define sub-class for different product types Electronics
class Electronics extends Product {
    async createProduct() {
        const newElectronics = await electronics.create(this.product_attributes)
        if (!newElectronics) throw new BadRequestError('create new clothing failed')
  
        const newProduct = await super.createProduct()
        if(!newProduct) throw new BadRequestError('create new product failed')
        
        return newProduct
    }
  }

  module.exports = ProdcutFactory