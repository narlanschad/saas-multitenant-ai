import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import type { UserRole } from '../models/User.js';

export interface AuthTokenPayload {
  userId: string;
  companyId: string;
  role: UserRole;
}

export function signAuthToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] });
}

export function verifyAuthToken(token: string): AuthTokenPayload {
  return jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;
}
