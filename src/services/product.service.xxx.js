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
    findProductById,
    updateProductById
 } = require('../models/repository/product.repo')
 const { removeUndefinedObject, updateNestedObjectParse } = require('../utils')
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

    static async updateProduct(type, productId, payload) {
        const ProductClass = ProductFactory.productRegistry[type]

        if (!ProductClass) throw new BadRequestError(`invalid product type ${type}`)

        return new ProductClass(payload).updateProduct(productId)
    }

    static async handleSearchProducts({ keywordSearch }) {
        return await searchProducts(keywordSearch)
    }

    // Put //
    static async publishProductShop({ product_shop, product_id }) {
        return await publishProductByShop({ product_shop, product_id })
    }


    /**
     * unblushing a product from a shop.
     *
     * @param {Object} params - The parameters for unblushing the product.
     * @param {string} params.product_shop - The ID of the shop from which the product is to be unpublished.
     * @param {string} params.product_id - The ID of the product to be unpublished.
     * @return {Promise<number>} - A promise that resolves to the number of modified documents.
     */
    static async unPublishProductShop({ product_shop, product_id }) {
        return await unPublishProductByShop({ product_shop, product_id })
    }

    // query 
    static async findAllDraftsShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isDraft: true }
        return await findAllDraftsForShop({ query, limit, skip })
    }

        /**
     * Find all published products for a specific shop.
     *
     * @param {Object} options - The options for finding the products.
     * @param {string} options.product_shop - The ID of the shop.
     * @param {number} [options.limit=50] - The maximum number of products to return.
     * @param {number} [options.skip=0] - The number of products to skip.
     * @return {Promise<Array>} A promise that resolves to an array of published products.
     */
    static async findAllPublishShop({ product_shop, limit = 50, skip = 0 }) {
        const query = { product_shop, isPublished: true }
        return await findAllPublishForShop({ query, limit, skip })
    }

        /**
     * Find all products with optional filters and pagination.
     *
     * @param {Object} options - The options for finding the products.
     * @param {number} [options.limit=50] - The maximum number of products to return.
     * @param {string} [options.sort='ctime'] - The field to sort the products by.
     * @param {number} [options.page=1] - The page number of the results.
     * @param {Object} [options.filter={ isPublished: true }] - The filters to apply to the products.
     * @param {boolean} [options.filter.isPublished=true] - Whether to include only published products.
     * @return {Promise<Array>} A promise that resolves to an array of products.
     */
    static async findAllProducts({ limit = 50, sort = 'ctime', page = 1,  filter = { isPublished: true }}) {
        return await findAllProducts({ limit, sort, page, filter, select: ['product_name', 'product_thumb', 'product_price'] })
    }

        /**
     * Find a product by its ID and return the product object.
     *
     * @param {Object} options - The options for finding the product.
     * @param {string} options.product_id - The ID of the product.
     * @param {Array} options.unSelect - The fields to exclude from the product object.
     * @return {Promise<Object>} A promise that resolves to the product object.
     */
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

    // update product
    async updateProduct(productId, bodyUpdate) {
        return await updateProductById({ productId, bodyUpdate, model: product })
    }
}

// Define sub-class for different product types Clothing
class Clothing extends Product {

    /**
     * Creates a new product by creating a new clothing item and then creating a new product.
     *
     * @return {Promise<Object>} The newly created product.
     * @throws {BadRequestError} If creating the clothing item or the product fails.
    */
  async createProduct() {
      const newClothing = await clothing.create(this.product_attributes)
      if (!newClothing) throw new BadRequestError('create new clothing failed')

      const newProduct = await super.createProduct()
      if(!newProduct) throw new BadRequestError('create new product failed')

      return newProduct
  }

  async updateProduct(productId) {
        /*
            TODO:{
                a: undefined,
                b: null
            } 
        */
        //    1. remove attr has null undefined
        /// Update Object Nested trước khi remove undefined để tránh trường hợp bị lỗi
        console.log('1::: this is', this);
        const updateNest = updateNestedObjectParse(this);
        const objectParams = removeUndefinedObject(updateNest)
        console.log('2::: objectParams', objectParams);
        //    2. check xem update o dau?? 
        if (objectParams.product_attributes) {
            // Update child
            await updateProductById({ 
                productId,
                bodyUpdate: updateNestedObjectParse(objectParams.product_attributes), 
                model: clothing })
        }
        const updateProduct = await super.updateProduct(productId, updateNestedObjectParse(objectParams))
        return updateProduct
    }
}

// Define sub-class for different product types Electronics
class Electronics extends Product {
    /**
     * Creates a new product by creating a new electronic item and then creating a new product.
     *
     * @return {Promise<Object>} The newly created product.
     * @throws {BadRequestError} If creating the electronic item or the product fails.
     */
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
    /**
     * Creates a new product by creating a new furniture item and then creating a new product.
     *
     * @return {Promise<Object>} The newly created product.
     * @throws {BadRequestError} If creating the furniture item or the product fails.
     */
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