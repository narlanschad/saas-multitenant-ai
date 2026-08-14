import { ProductModel, type Product } from '../../models/Product.js';

export interface ProductFilters {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
}

// Every method below requires companyId as an explicit argument rather than
// an optional filter, so a caller cannot accidentally omit tenant scoping.

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function findAll(companyId: string, filters: ProductFilters = {}) {
  const mongoFilter: Record<string, unknown> = { companyId };

  if (filters.query) {
    const pattern = escapeRegex(filters.query);
    mongoFilter.$or = [
      { name: { $regex: pattern, $options: 'i' } },
      { description: { $regex: pattern, $options: 'i' } },
    ];
  }
  if (filters.category) {
    mongoFilter.category = { $regex: `^${escapeRegex(filters.category)}$`, $options: 'i' };
  }
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    mongoFilter.price = {
      ...(filters.minPrice !== undefined && { $gte: filters.minPrice }),
      ...(filters.maxPrice !== undefined && { $lte: filters.maxPrice }),
    };
  }

  return ProductModel.find(mongoFilter).sort({ createdAt: -1 });
}

export function findDistinctCategories(companyId: string): Promise<string[]> {
  return ProductModel.distinct('category', { companyId });
}

export function findById(companyId: string, productId: string) {
  return ProductModel.findOne({ _id: productId, companyId });
}

export function create(companyId: string, input: CreateProductInput) {
  return ProductModel.create({ ...input, companyId });
}

export function updateById(companyId: string, productId: string, input: Partial<CreateProductInput>) {
  return ProductModel.findOneAndUpdate({ _id: productId, companyId }, input, { new: true });
}

export function deleteById(companyId: string, productId: string): Promise<Product | null> {
  return ProductModel.findOneAndDelete({ _id: productId, companyId });
}
