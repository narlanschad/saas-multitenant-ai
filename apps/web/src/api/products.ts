import { apiClient } from './client';

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  createdAt: string;
}

export interface ProductInput {
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
}

export async function fetchProducts(): Promise<Product[]> {
  const { data } = await apiClient.get<Product[]>('/products');
  return data;
}

export async function createProductRequest(input: ProductInput): Promise<Product> {
  const { data } = await apiClient.post<Product>('/products', input);
  return data;
}

export async function updateProductRequest(id: string, input: Partial<ProductInput>): Promise<Product> {
  const { data } = await apiClient.patch<Product>(`/products/${id}`, input);
  return data;
}

export async function deleteProductRequest(id: string): Promise<void> {
  await apiClient.delete(`/products/${id}`);
}
