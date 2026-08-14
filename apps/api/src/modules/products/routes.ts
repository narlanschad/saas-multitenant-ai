import { Router } from 'express';
import { authenticate } from '../../middlewares/authenticate.js';
import { authorize } from '../../middlewares/authorize.js';
import { validate } from '../../middlewares/validate.js';
import {
  createProductHandler,
  deleteProductHandler,
  getProductHandler,
  listProductsHandler,
  updateProductHandler,
} from './controller.js';
import {
  createProductSchema,
  listProductsQuerySchema,
  productIdParamsSchema,
  updateProductSchema,
} from './schemas.js';

export const productsRouter = Router();

productsRouter.use(authenticate);

productsRouter.get('/', validate({ query: listProductsQuerySchema }), listProductsHandler);
productsRouter.get('/:id', validate({ params: productIdParamsSchema }), getProductHandler);

productsRouter.post(
  '/',
  authorize('admin'),
  validate({ body: createProductSchema }),
  createProductHandler,
);
productsRouter.patch(
  '/:id',
  authorize('admin'),
  validate({ params: productIdParamsSchema, body: updateProductSchema }),
  updateProductHandler,
);
productsRouter.delete(
  '/:id',
  authorize('admin'),
  validate({ params: productIdParamsSchema }),
  deleteProductHandler,
);
