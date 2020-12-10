import { createLogger } from '../utils/logger';
import { Product } from "../models/Product";
import { CreateProductRequest } from "../requests/CreateProductRequest";
import { UpdateProductRequest } from '../requests/UpdateProductRequest'
import { ProductRepository } from '../repositories/productRepository'
import { v4 } from 'uuid'
const logger = createLogger('ProductBloc')
const productRepository = new ProductRepository()
const s3BucketName = process.env.PRODUCTS_S3_BUCKET

export const createProduct = async (
  userId:string, 
  createProductRequest: CreateProductRequest
): Promise<Product> => {
  logger.info('Lets create product')

  const productId = v4()
  const attachedImageUrl = `https://${s3BucketName}.s3.amazonaws.com/${productId}`

  const productModel: Product = {
    userId,
    productId,
    sold: false,
    attachedImageUrl: attachedImageUrl,
    createdAt: new Date().toISOString(),
    ...createProductRequest
  }

  const product: Product = await productRepository.createProduct(productModel)
  return product
}


export const getAllProductsByUser = async (
  userId: string
): Promise<Product[]> => {
  logger.info('In getAllProductsyUser')

  const products: Product[] = await productRepository.getAllProductsByUser(userId)
  return products
}


export const getProduct = async (
  userId: string,
  productId: string
): Promise<Product> => {
  logger.info('In getProduct')

  const product: Product = await productRepository.getProduct(userId, productId)
  return product
}

/**
 * 
 * @param userId 
 * @param productId 
 * @param updateProductRequest
 * @returns product 
 */
export const updateProduct = async (
  userId: string,
  productId: string,
  updateProductRequest: UpdateProductRequest
): Promise<Product> => {
  logger.info('In update Product')

  const productModel: Product = {
    productId,
    userId,
    createdAt: null,
    ... updateProductRequest
  }

  const product: Product = await productRepository.updateProduct(productModel)
  return product
}


export const deleteProduct = async(
  userId: string,
  productId: string
): Promise<string> => {
  logger.info(`Lets delete product by id ${productId}`)

  const productIdStr: string = await productRepository.deleteProduct(userId, productId)

  return productIdStr
}