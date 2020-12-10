import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk-core'
import { createLogger } from '../utils/logger'

const logger = createLogger('AttachmentImageRespository')
const XAWS = AWSXRay.captureAWS(AWS)

export class AttachmentImageRespository {
  constructor(
    private readonly s3 = new XAWS.S3({ signatureVersion: process.env.S3_SIGNATURE_VERSION }),
    private readonly s3BucketName = process.env.PRODUCTS_S3_BUCKET,
    private readonly signedUrlExpiration = process.env.SIGNED_URL_EXPIRATION
  ){}

  /**
   * 
   * @param todoId 
   * @returns string
   */
  async generateUploadUrl(productId: string): Promise<string> {
    logger.info(`About to generate upload url for todo with id ${productId}`)

    const response = this.s3.getSignedUrl('putObject', {
      Bucket: this.s3BucketName,
      Key: productId,
      Expires: Number(this.signedUrlExpiration)
    })
    return response
  }
}