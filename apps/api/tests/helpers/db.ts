import mongoose from 'mongoose';
import { env } from '../../src/config/env.js';

export async function connectTestDb() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(env.MONGODB_URI);
  }
}

export async function clearTestDb() {
  const collections = mongoose.connection.collections;
  await Promise.all(Object.values(collections).map((collection) => collection.deleteMany({})));
}

export async function disconnectTestDb() {
  await mongoose.disconnect();
}
