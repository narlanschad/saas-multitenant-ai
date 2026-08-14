import request from 'supertest';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { createApp } from '../src/app.js';
import { clearTestDb, connectTestDb, disconnectTestDb } from './helpers/db.js';

const app = createApp();

beforeAll(connectTestDb);
afterEach(clearTestDb);
afterAll(disconnectTestDb);

describe('POST /auth/register', () => {
  it('creates a company and its first admin user', async () => {
    const response = await request(app).post('/auth/register').send({
      companyName: 'Acme Retail',
      name: 'Alice Admin',
      email: 'alice@acme.test',
      password: 'supersecret123',
    });

    expect(response.status).toBe(201);
    expect(response.body.token).toBeTypeOf('string');
    expect(response.body.user.role).toBe('admin');
    expect(response.body.user.passwordHash).toBeUndefined();
  });

  it('rejects a duplicate email with 409', async () => {
    await request(app).post('/auth/register').send({
      companyName: 'Acme Retail',
      name: 'Alice Admin',
      email: 'alice@acme.test',
      password: 'supersecret123',
    });

    const response = await request(app).post('/auth/register').send({
      companyName: 'Another Co',
      name: 'Someone Else',
      email: 'alice@acme.test',
      password: 'supersecret123',
    });

    expect(response.status).toBe(409);
  });

  it('rejects an invalid payload with 422', async () => {
    const response = await request(app).post('/auth/register').send({
      companyName: 'A',
      name: '',
      email: 'not-an-email',
      password: '123',
    });

    expect(response.status).toBe(422);
  });
});

describe('POST /auth/login', () => {
  it('logs in with valid credentials', async () => {
    await request(app).post('/auth/register').send({
      companyName: 'Acme Retail',
      name: 'Alice Admin',
      email: 'alice@acme.test',
      password: 'supersecret123',
    });

    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'alice@acme.test', password: 'supersecret123' });

    expect(response.status).toBe(200);
    expect(response.body.token).toBeTypeOf('string');
  });

  it('rejects an unknown email with 401', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'nobody@acme.test', password: 'supersecret123' });

    expect(response.status).toBe(401);
  });

  it('rejects a wrong password with 401', async () => {
    await request(app).post('/auth/register').send({
      companyName: 'Acme Retail',
      name: 'Alice Admin',
      email: 'alice@acme.test',
      password: 'supersecret123',
    });

    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'alice@acme.test', password: 'wrong-password' });

    expect(response.status).toBe(401);
  });
});
