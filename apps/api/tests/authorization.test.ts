import request from 'supertest';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';
import { clearTestDb, connectTestDb, disconnectTestDb } from './helpers/db.js';
import { addUserToCompany, registerCompany } from './helpers/factories.js';

const app = createApp();

beforeAll(connectTestDb);
afterEach(clearTestDb);
afterAll(disconnectTestDb);

const sampleProduct = {
  name: 'Notebook Pro',
  description: 'A fast laptop',
  price: 4999.9,
  category: 'Electronics',
  imageUrl: 'https://example.com/notebook.png',
};

describe('role-based authorization on /products', () => {
  it('allows an admin to create a product', async () => {
    const { token } = await registerCompany(app);

    const response = await request(app)
      .post('/products')
      .set('Authorization', `Bearer ${token}`)
      .send(sampleProduct);

    expect(response.status).toBe(201);
    expect(response.body.name).toBe(sampleProduct.name);
  });

  it('rejects a regular user creating a product with 403', async () => {
    const { companyId } = await registerCompany(app);
    await addUserToCompany(companyId, 'user@acme.test', 'supersecret123');

    const loginResponse = await request(app)
      .post('/auth/login')
      .send({ email: 'user@acme.test', password: 'supersecret123' });

    const response = await request(app)
      .post('/products')
      .set('Authorization', `Bearer ${loginResponse.body.token}`)
      .send(sampleProduct);

    expect(response.status).toBe(403);
  });

  it('allows a regular user to list products', async () => {
    const { token, companyId } = await registerCompany(app);
    await request(app).post('/products').set('Authorization', `Bearer ${token}`).send(sampleProduct);

    await addUserToCompany(companyId, 'user@acme.test', 'supersecret123');
    const loginResponse = await request(app)
      .post('/auth/login')
      .send({ email: 'user@acme.test', password: 'supersecret123' });

    const response = await request(app)
      .get('/products')
      .set('Authorization', `Bearer ${loginResponse.body.token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });

  it('rejects requests with no token with 401', async () => {
    const response = await request(app).get('/products');
    expect(response.status).toBe(401);
  });
});
