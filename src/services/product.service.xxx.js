'use strict'

const { product, clothing, electronics, furniture } = require('../models/product.model')
const {BadRequestError} = require('../core/error.response')
// define Factory class to create product
class ProductFactory {
    /*
        type: 'Clothing',
        payload
    */
   static productRegistry = {} // key-class

   // factory pattern
   static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef
   }
    static async createProduct(type, payload) {
        const ProductClass = ProductFactory.productRegistry[type]

        if (!ProductClass) throw new BadRequestError(`invalid product type ${type}`)

        return new ProductClass(payload).createProduct()
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
    async createProduct(product_id) {
        return await product.create({
            ...this,
            _id: product_id
        })
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
        const newElectronics = await electronics.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newElectronics) throw new BadRequestError('create new clothing failed')
  
        const newProduct = await super.createProduct(newElectronics._id)
        if(!newProduct) throw new BadRequestError('create new product failed')
        
        return newProduct
    }
  }

  class Furniture extends Product {
    async createProduct() {
        const newFurniture = await furniture.create({
            ...this.product_attributes,
            product_shop: this.product_shop
        })
        if (!newFurniture) throw new BadRequestError('create new newFurniture failed')
  
        const newProduct = await super.createProduct(newFurniture._id)
        if(!newProduct) throw new BadRequestError('create new product failed')
        
        return newProduct
    }
  }

  // register product type
  ProductFactory.registerProductType('Clothing', Clothing)
  ProductFactory.registerProductType('Electronics', Electronics)
  ProductFactory.registerProductType('Furniture', Furniture)

  module.exports = ProductFactory