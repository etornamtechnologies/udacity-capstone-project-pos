import 'source-map-support/register'
import { createLogger } from '../../utils/logger'
import { cors } from 'middy/middlewares'
import * as middy from 'middy'

const logger = createLogger('getTodosHandler')

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getToken, parseUserId } from '../../auth/utils'
import { getAllProductsByUser } from '../../business_logic/productBloc'
import { Product } from '../../models/Product'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('GetTodosHandler')
    logger.info('Authentication header', event.headers.Authorization)
  // TODO: Get all TODO items for a current user
    try {
      const tokenStr: string = getToken(event.headers.Authorization)
      const userId: string = parseUserId(tokenStr)
      logger.info('user id', userId)
      const products: Product[] = await getAllProductsByUser(userId)
      
      return {
        statusCode: 200,
        body: JSON.stringify({ products: products })
      }
    } catch(err) {
      logger.error(err)
      return {
        statusCode: 500,
        body: err.message
      }
    }
  }
)

handler.use(cors({ credentials: true }))
