import { NotFoundError } from '../../lib/errors.js';
import * as productRepository from './repository.js';
import type { ProductFilters, CreateProductInput } from './repository.js';

export function listProducts(companyId: string, filters: ProductFilters) {
  return productRepository.findAll(companyId, filters);
}

export async function getProduct(companyId: string, productId: string) {
  const product = await productRepository.findById(companyId, productId);
  if (!product) {
    throw new NotFoundError('Produto não encontrado');
  }
  return product;
}

export function createProduct(companyId: string, input: CreateProductInput) {
  return productRepository.create(companyId, input);
}

export async function updateProduct(
  companyId: string,
  productId: string,
  input: Partial<CreateProductInput>,
) {
  const product = await productRepository.updateById(companyId, productId, input);
  if (!product) {
    throw new NotFoundError('Produto não encontrado');
  }
  return product;
}

export async function deleteProduct(companyId: string, productId: string) {
  const product = await productRepository.deleteById(companyId, productId);
  if (!product) {
    throw new NotFoundError('Produto não encontrado');
  }
}
