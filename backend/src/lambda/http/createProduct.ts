import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'

import { CreateProductRequest } from '../../requests/CreateProductRequest'
import * as middy from 'middy'
import { getToken, parseUserId } from '../../auth/utils'
import { createProduct } from '../../business_logic/productBloc'
import { cors } from 'middy/middlewares'
import { Product } from '../../models/Product'


const logger = createLogger('create todo handler')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('In Create Product Handler')
    const reqBody: CreateProductRequest = JSON.parse(event.body)

    //lets get userId from jwtToken

    let validateErrMsg = ''
    if(!reqBody.productName) validateErrMsg = 'Name required!'
    if(!reqBody.description) validateErrMsg = 'Description required!'
    if(!reqBody.price) validateErrMsg = 'Price required!'
    
  
    if(validateErrMsg) {
      return {
        statusCode: 500,
        body: JSON.stringify({ message: validateErrMsg })
      }
    }
    
    try {
      const tokenStr = getToken(event.headers.Authorization)
      logger.info(`token Str ${tokenStr}`)
      const userId = parseUserId(tokenStr)
      logger.info(`userId ${userId}`)
      const createProductResponse: Product = await createProduct(userId, reqBody)
      
      return {
        statusCode: 200,
        body: JSON.stringify({ item: createProductResponse })
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