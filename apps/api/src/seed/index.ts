import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { logger } from '../lib/logger.js';
import { CompanyModel } from '../models/Company.js';
import { ProductModel } from '../models/Product.js';
import { UserModel } from '../models/User.js';
import { seedCompanies } from './data.js';

const SALT_ROUNDS = 10;

async function seed() {
  await mongoose.connect(env.MONGODB_URI);

  await Promise.all([
    CompanyModel.deleteMany({}),
    UserModel.deleteMany({}),
    ProductModel.deleteMany({}),
  ]);

  for (const seedCompany of seedCompanies) {
    const company = await CompanyModel.create({ name: seedCompany.name });

    for (const account of [seedCompany.admin, seedCompany.user]) {
      const passwordHash = await bcrypt.hash(account.password, SALT_ROUNDS);
      await UserModel.create({
        companyId: company._id,
        name: account.name,
        email: account.email,
        passwordHash,
        role: account === seedCompany.admin ? 'admin' : 'user',
      });
    }

    await ProductModel.insertMany(
      seedCompany.products.map((product) => ({ ...product, companyId: company._id })),
    );

    logger.info(`Seeded ${seedCompany.name}: ${seedCompany.products.length} products`);
  }

  logger.info('Seed complete');
  await mongoose.disconnect();
}

seed().catch((error) => {
  logger.error(error, 'Seed failed');
  process.exit(1);
});
