import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(2000),
  price: z.number().nonnegative(),
  category: z.string().trim().min(1).max(100),
  imageUrl: z.string().trim().url(),
});

export const updateProductSchema = createProductSchema.partial();

export const productIdParamsSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid product id'),
});

export const listProductsQuerySchema = z.object({
  query: z.string().trim().min(1).optional(),
  category: z.string().trim().min(1).optional(),
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
});
