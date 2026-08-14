import request from 'supertest';
import type { Express } from 'express';
import { UserModel } from '../../src/models/User.js';

interface RegisteredCompany {
  token: string;
  companyId: string;
  userId: string;
}

let emailCounter = 0;

export async function registerCompany(app: Express, overrides: Partial<{ companyName: string; name: string; email: string; password: string }> = {}): Promise<RegisteredCompany> {
  emailCounter += 1;
  const response = await request(app)
    .post('/auth/register')
    .send({
      companyName: overrides.companyName ?? `Test Company ${emailCounter}`,
      name: overrides.name ?? 'Admin User',
      email: overrides.email ?? `admin${emailCounter}@example.test`,
      password: overrides.password ?? 'supersecret123',
    });

  return {
    token: response.body.token,
    companyId: response.body.user.companyId,
    userId: response.body.user.id,
  };
}

export async function addUserToCompany(companyId: string, email: string, password: string) {
  const bcrypt = await import('bcryptjs');
  const passwordHash = await bcrypt.hash(password, 4);
  await UserModel.create({
    companyId,
    name: 'Regular User',
    email,
    passwordHash,
    role: 'user',
  });
}
