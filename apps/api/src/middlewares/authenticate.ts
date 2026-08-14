import type { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../lib/errors.js';
import { verifyAuthToken } from '../lib/jwt.js';

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice('Bearer '.length) : undefined;

  if (!token) {
    throw new UnauthorizedError();
  }

  try {
    req.auth = verifyAuthToken(token);
  } catch {
    throw new UnauthorizedError('Token inválido ou expirado');
  }

  next();
}
