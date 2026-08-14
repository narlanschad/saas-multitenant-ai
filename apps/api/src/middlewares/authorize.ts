import type { NextFunction, Request, Response } from 'express';
import { ForbiddenError, UnauthorizedError } from '../lib/errors.js';
import type { UserRole } from '../models/User.js';

export function authorize(...allowedRoles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.auth) {
      throw new UnauthorizedError();
    }

    if (!allowedRoles.includes(req.auth.role)) {
      throw new ForbiddenError();
    }

    next();
  };
}
