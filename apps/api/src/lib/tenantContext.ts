import type { Request } from 'express';
import { UnauthorizedError } from './errors.js';

/**
 * The only sanctioned way to obtain a tenant id in a request handler.
 * Never read companyId from req.body/query/params — a client could set it to
 * any value and read or write another company's data.
 */
export function getTenantId(req: Request): string {
  if (!req.auth) {
    throw new UnauthorizedError();
  }
  return req.auth.companyId;
}
