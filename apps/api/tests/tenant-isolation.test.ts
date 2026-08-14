import request from 'supertest';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';
import { clearTestDb, connectTestDb, disconnectTestDb } from './helpers/db.js';
import { registerCompany } from './helpers/factories.js';

const app = createApp();

beforeAll(connectTestDb);
afterEach(clearTestDb);
afterAll(disconnectTestDb);

async function createProduct(token: string, name: string) {
  const response = await request(app).post('/products').set('Authorization', `Bearer ${token}`).send({
    name,
    description: 'A product',
    price: 100,
    category: 'General',
    imageUrl: 'https://example.com/product.png',
  });
  return response.body._id as string;
}

describe('multi-tenant isolation', () => {
  it('never returns another company\'s products in a listing', async () => {
    const companyA = await registerCompany(app, { email: 'admin@a.test' });
    const companyB = await registerCompany(app, { email: 'admin@b.test' });

    await createProduct(companyA.token, 'Company A Product');
    await createProduct(companyB.token, 'Company B Product');

    const response = await request(app)
      .get('/products')
      .set('Authorization', `Bearer ${companyA.token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].name).toBe('Company A Product');
  });

  it('returns 404 — not the other company\'s data — when fetching a product by id across tenants', async () => {
    const companyA = await registerCompany(app, { email: 'admin@a.test' });
    const companyB = await registerCompany(app, { email: 'admin@b.test' });

    const companyBProductId = await createProduct(companyB.token, 'Company B Product');

    const response = await request(app)
      .get(`/products/${companyBProductId}`)
      .set('Authorization', `Bearer ${companyA.token}`);

    expect(response.status).toBe(404);
  });

  it('does not allow deleting another company\'s product', async () => {
    const companyA = await registerCompany(app, { email: 'admin@a.test' });
    const companyB = await registerCompany(app, { email: 'admin@b.test' });

    const companyBProductId = await createProduct(companyB.token, 'Company B Product');

    const deleteResponse = await request(app)
      .delete(`/products/${companyBProductId}`)
      .set('Authorization', `Bearer ${companyA.token}`);
    expect(deleteResponse.status).toBe(404);

    const stillThereResponse = await request(app)
      .get(`/products/${companyBProductId}`)
      .set('Authorization', `Bearer ${companyB.token}`);
    expect(stillThereResponse.status).toBe(200);
  });

  it('ignores a companyId supplied in the request body when creating a product', async () => {
    const companyA = await registerCompany(app, { email: 'admin@a.test' });
    const companyB = await registerCompany(app, { email: 'admin@b.test' });

    const response = await request(app)
      .post('/products')
      .set('Authorization', `Bearer ${companyA.token}`)
      .send({
        name: 'Spoofed Product',
        description: 'Attempts to spoof tenant',
        price: 1,
        category: 'General',
        imageUrl: 'https://example.com/x.png',
        companyId: companyB.companyId,
      });

    expect(response.status).toBe(201);
    expect(response.body.companyId).toBe(companyA.companyId);
  });
});
