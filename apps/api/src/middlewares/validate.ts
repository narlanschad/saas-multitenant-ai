import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';
import { ValidationError } from '../lib/errors.js';

interface ValidationSchemas {
  body?: ZodType;
  params?: ZodType;
  query?: ZodType;
}

export function validate(schemas: ValidationSchemas) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (schemas.body) {
      const result = schemas.body.safeParse(req.body);
      if (!result.success) {
        throw new ValidationError('Invalid request body', result.error.flatten());
      }
      req.body = result.data;
    }

    if (schemas.params) {
      const result = schemas.params.safeParse(req.params);
      if (!result.success) {
        throw new ValidationError('Invalid request parameters', result.error.flatten());
      }
      req.params = result.data as typeof req.params;
    }

    if (schemas.query) {
      const result = schemas.query.safeParse(req.query);
      if (!result.success) {
        throw new ValidationError('Invalid query parameters', result.error.flatten());
      }
      Object.assign(req.query, result.data);
    }

    next();
  };
}
