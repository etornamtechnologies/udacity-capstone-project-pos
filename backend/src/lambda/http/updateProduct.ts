import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'

import { UpdateProductRequest } from '../../requests/UpdateProductRequest'
import * as middy from 'middy'
import { getToken, parseUserId } from '../../auth/utils'
import { cors } from 'middy/middlewares'
import { updateProduct } from '../../business_logic/productBloc'
import { Product } from '../../models/Product'


const logger = createLogger('create-product-handler')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('In Update Product Handler')

    const productId = event.pathParameters.productId
    const updateProductRequest: UpdateProductRequest = JSON.parse(event.body)

    //lets validate request body
    let errMsg = null;
    if(!updateProductRequest.productName) errMsg = 'Name required!'
    if(!updateProductRequest.description) errMsg = 'Description required!'
    if(!updateProductRequest.price) errMsg = 'Price require!'
    if(!updateProductRequest.sold == undefined) errMsg = 'Invalid request! please provide sold value'
    if(errMsg) {
      return {
        statusCode: 500,
        body: JSON.stringify({message: errMsg})
      }
    }

    try {
      const jwtTokenStr: string = getToken(event.headers.Authorization)
      const userId: string = parseUserId(jwtTokenStr)
      const updatedProduct: Product = await updateProduct(userId, productId, updateProductRequest)
      
      return {
        statusCode: 200,
        body: JSON.stringify({ product: updatedProduct })
      }
    } catch(error) {
      logger.error(error)
      return {
        statusCode: 500,
        body: error.message
      }
    }
  }
)

handler.use(cors({ credentials: true }))
