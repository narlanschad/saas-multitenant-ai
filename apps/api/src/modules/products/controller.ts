import type { Request, Response } from 'express';
import { asyncHandler } from '../../lib/asyncHandler.js';
import { getTenantId } from '../../lib/tenantContext.js';
import * as productService from './service.js';
import type { ProductFilters } from './repository.js';

export const listProductsHandler = asyncHandler(async (req: Request, res: Response) => {
  const companyId = getTenantId(req);
  const products = await productService.listProducts(companyId, req.query as ProductFilters);
  res.status(200).json(products);
});

export const getProductHandler = asyncHandler(async (req: Request, res: Response) => {
  const companyId = getTenantId(req);
  const product = await productService.getProduct(companyId, req.params.id as string);
  res.status(200).json(product);
});

export const createProductHandler = asyncHandler(async (req: Request, res: Response) => {
  const companyId = getTenantId(req);
  const product = await productService.createProduct(companyId, req.body);
  res.status(201).json(product);
});

export const updateProductHandler = asyncHandler(async (req: Request, res: Response) => {
  const companyId = getTenantId(req);
  const product = await productService.updateProduct(companyId, req.params.id as string, req.body);
  res.status(200).json(product);
});

export const deleteProductHandler = asyncHandler(async (req: Request, res: Response) => {
  const companyId = getTenantId(req);
  await productService.deleteProduct(companyId, req.params.id as string);
  res.status(204).send();
});
