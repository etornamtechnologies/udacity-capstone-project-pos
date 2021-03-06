import { AttachmentImageRespository } from '../repositories/attachementImageRepository'
import { createLogger } from '../utils/logger'

const attachmentImageRespository = new AttachmentImageRespository()

const logger = createLogger('AttachmentImageBloc')

export const generateSignedUrl = async(
  productId: string
): Promise<string> => {
  logger.info('In Attachment imgae bloc')
  
  return  attachmentImageRespository.generateUploadUrl(productId)
}