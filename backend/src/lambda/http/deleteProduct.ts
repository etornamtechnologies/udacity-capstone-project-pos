import 'source-map-support/register'
import { createLogger } from '../../utils/logger'
import { cors } from 'middy/middlewares'
import * as middy from 'middy'

const logger = createLogger('deleteTodoHandler')

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getToken, parseUserId } from '../../auth/utils'
import { deleteProduct } from '../../business_logic/productBloc'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    logger.info('DeleteTodoHandler')

    const productId: string = event.pathParameters.productId

    try {
      const tokenStr = getToken(event.headers.Authorization)
      const userId: string = parseUserId(tokenStr)
      const deletedProductId: string = await deleteProduct(userId, productId)
      
      return {
        statusCode: 200,
        body: JSON.stringify({ productId: deletedProductId })
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

