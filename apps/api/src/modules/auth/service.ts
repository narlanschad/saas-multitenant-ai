import bcrypt from 'bcryptjs';
import { ConflictError, UnauthorizedError } from '../../lib/errors.js';
import { signAuthToken } from '../../lib/jwt.js';
import { CompanyModel } from '../../models/Company.js';
import { UserModel } from '../../models/User.js';
import type { registerSchema, loginSchema } from './schemas.js';
import type { z } from 'zod';

const SALT_ROUNDS = 10;

interface AuthResult {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    companyId: string;
    companyName: string;
  };
}

export async function register(input: z.infer<typeof registerSchema>): Promise<AuthResult> {
  const existing = await UserModel.findOne({ email: input.email });
  if (existing) {
    throw new ConflictError('Já existe uma conta com este email');
  }

  const company = await CompanyModel.create({ name: input.companyName });
  const passwordHash = await bcrypt.hash(input.password, SALT_ROUNDS);

  const user = await UserModel.create({
    companyId: company._id,
    name: input.name,
    email: input.email,
    passwordHash,
    role: 'admin',
  });

  const token = signAuthToken({
    userId: user._id.toString(),
    companyId: company._id.toString(),
    role: user.role,
  });

  return {
    token,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      companyId: company._id.toString(),
      companyName: company.name,
    },
  };
}

export async function login(input: z.infer<typeof loginSchema>): Promise<AuthResult> {
  const user = await UserModel.findOne({ email: input.email }).select('+passwordHash');

  if (!user) {
    throw new UnauthorizedError('Email ou senha inválidos');
  }

  const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);
  if (!passwordMatches) {
    throw new UnauthorizedError('Email ou senha inválidos');
  }

  const company = await CompanyModel.findById(user.companyId);
  if (!company) {
    throw new UnauthorizedError('Email ou senha inválidos');
  }

  const token = signAuthToken({
    userId: user._id.toString(),
    companyId: company._id.toString(),
    role: user.role,
  });

  return {
    token,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      companyId: company._id.toString(),
      companyName: company.name,
    },
  };
}
