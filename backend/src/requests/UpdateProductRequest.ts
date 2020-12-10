/**
 * Fields in a request to update a single Product item.
 */
export interface UpdateProductRequest {
  productName: string
  description: string,
  size: string,
  price: number,
  sold: boolean
}