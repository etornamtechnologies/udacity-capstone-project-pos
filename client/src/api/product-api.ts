import Axios from 'axios'
import { apiEndpoint } from '../config'
import { CreateProductRequest } from '../types/CreateProductRequest'
import { Product } from '../types/Product'
import { UpdateProductRequest } from '../types/UpdateProductRequest'

const applicationJson = 'application/json'

export async function getProducts(idToken: string): Promise<Product[]> {
  const response = await Axios.get(`${apiEndpoint}/products`, {
    headers: {
      'Content-Type': applicationJson,
      'Authorization': `Bearer ${idToken}`
    }
  })

  return response.data.products || []
}

export async function getProduct(idToken: string, productId: string): Promise<Product> {
  const response = await Axios.get(`${apiEndpoint}/products/${productId}`, {
    headers: {
      'Content-Type': applicationJson,
      'Authorization': `Bearer ${idToken}`
    }
  })

  return response.data.product || {}
}

export async function createProduct(
  idToken:string,
  newProduct: CreateProductRequest
): Promise<Product> {
  const response = await Axios.post(`${apiEndpoint}/products`, JSON.stringify(newProduct), {
    headers: {
      'Content-Type': applicationJson,
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.product
}

export async function updateProduct(
  idToken: string,
  productId: string,
  updatedProduct: UpdateProductRequest
): Promise<Product> {
  const response = await Axios.patch(`${apiEndpoint}/products/${productId}`, JSON.stringify(updatedProduct), {
    headers: {
      'Content-Type': applicationJson,
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.product
}


export async function deleteProduct(
  idToken: string,
  productId: string
): Promise<string> {
  const response = await Axios.delete(`${apiEndpoint}/products/${productId}`, {
    headers: {
      'Content-Type': applicationJson,
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.productId
}

export async function getUploadUrl(
  idToken: string,
  productId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/products/${productId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}