/**
 * Fields in a request to create a single Product.
 */
export interface CreateProductRequest {
  productName: string
  description: string,
  size: string,
  price: number
}
