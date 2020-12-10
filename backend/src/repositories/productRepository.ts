import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk-core'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { Product } from '../models/Product'

const logger = createLogger('ProductRepository')
const XAWS = AWSXRay.captureAWS(AWS)

export class ProductRepository {
  constructor(
    private readonly productsTable: string = process.env.PRODUCTS_TABLE,
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly userIdIndex: string = process.env.USER_ID_INDEX,
  ){}

  /**
   * 
   * @param userId 
   * @returns Product[]
   */
  async getAllProductsByUser(userId: string): Promise<Product[]> {
    logger.info('------->Lets Get Products')
    const response = await this.docClient
      .query({
        TableName: this.productsTable,
        IndexName: this.userIdIndex,
        KeyConditionExpression: 'userId= :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      }).promise()

    const products = response.Items as Product[]
    logger.info(`products: ${products}`)
    return products;
  }

  async getProduct(userId: string, productId: string): Promise<Product> {
    logger.info('userID', userId)
    logger.info('productId', productId)
    logger.info('------->Lets Get Products')
    const params = {
      "userId": userId,
      "productId": productId
    }
    const response = await this.docClient
      .get({
        TableName: this.productsTable,
        ConsistentRead: true,
        Key: params
      }).promise()

    const product: Product = response.Item as Product
    logger.info(`product: ${product}`)
    return product;
  }

  /**
   * 
   * @param userId 
   * @param createProductRequest 
   * @returns Product
   */
  async createProduct(product: Product): Promise<Product> {
    logger.info('--->Lets save product', product)
    let productModel = { ...product }

    await this.docClient
      .put({
        TableName: this.productsTable,
        Item: product
      }).promise()

    logger.info('Product created successfully')
    return productModel
  }

  async updateProduct(product: Product): Promise<Product> {
    logger.info('Lets update product')

    const updateExpression = 'SET productName = :productName, description = :productDescription, size = :productSize, price = :productPrice, sold = :sold'

    await this.docClient
      .update({
        TableName: this.productsTable,
        Key: { productId: product.productId, userId: product.userId },
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: {
          ':productName': product.productName,
          ':productDescription': product.description,
          ':productSize': product.size,
          ':productPrice': product.price,
          ':sold': product.sold
        },
        ReturnValues: 'UPDATED_NEW'
      }).promise()

      return product
  }
  
  /**
   * 
   * @param userId 
   * @param productId
   * @returns productId 
   */
  async deleteProduct(userId: string, productId: string): Promise<string> {
    logger.info(`Lets delete product by id ${productId}`)

    await this.docClient
      .delete({
        TableName: this.productsTable,
        Key: { userId: userId, productId: productId },
        ConditionExpression: 'productId = :productId',
        ExpressionAttributeValues: {
          ':productId': productId
        }
      }).promise()

    return productId
  }
}