'use strict'

const { product, clothing, electronics, furniture } = require('../models/product.model')
const {BadRequestError} = require('../core/error.response')
const { 
    findAllDraftsForShop,
    publishProductByShop,
    findAllPublishForShop,
    unPublishProductByShop,
    searchProducts,
    findAllProducts,
    findProductById
 } = require('../models/repository/product.repo')
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

    static async updateProduct(type, payload) {
        const ProductClass = ProductFactory.productRegistry[type]

        if (!ProductClass) throw new BadRequestError(`invalid product type ${type}`)

        return new ProductClass(payload).createProduct()
    }

    static async handleSearchProducts({ keywordSearch }) {
        return await searchProducts(keywordSearch)
    }

    // Put //
    static async publishProductShop({ product_shop, product_id }) {
        return await publishProductByShop({ product_shop, product_id })
    }

    static async unPublishProductShop({ product_shop, product_id }) {
        return await unPublishProductByShop({ product_shop, product_id })
    }

    // query 
    static async findAllDraftsShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true }
        return await findAllDraftsForShop({ query, limit, skip })
    }

    static async findAllPublishShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isPublished: true }
        return await findAllPublishForShop({ query, limit, skip })
    }

    static async findAllProducts({ limit = 50, sort = 'ctime', page = 1,  filter = { isPublished: true }}) {
        return await findAllProducts({ limit, sort, page, filter, select: ['product_name', 'product_thumb', 'product_price'] })
    }

    static async findProductById({ product_id }) {
        return await findProductById({ product_id, unSelect: ['__v'] })
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