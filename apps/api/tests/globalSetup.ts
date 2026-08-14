import { MongoMemoryServer } from 'mongodb-memory-server';

export default async function setup() {
  const mongod = await MongoMemoryServer.create();

  process.env.MONGODB_URI = mongod.getUri();
  process.env.JWT_SECRET = 'test-only-secret-not-used-anywhere-real';
  process.env.JWT_EXPIRES_IN = '2h';
  process.env.OPENROUTER_API_KEY = 'test-key-not-called-in-unit-tests';
  process.env.WEB_ORIGIN = 'http://localhost:5173';

  return async () => {
    await mongod.stop();
  };
}
