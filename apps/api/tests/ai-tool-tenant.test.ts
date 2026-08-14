import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import {
  executeSearchProducts,
  searchProductsTool,
  type SearchProductsArgs,
} from '../src/ai/tools/searchProducts.js';
import { CompanyModel } from '../src/models/Company.js';
import { ProductModel } from '../src/models/Product.js';
import { clearTestDb, connectTestDb, disconnectTestDb } from './helpers/db.js';

beforeAll(connectTestDb);
afterEach(clearTestDb);
afterAll(disconnectTestDb);

async function seedCompanyWithProduct(companyName: string, productName: string) {
  const company = await CompanyModel.create({ name: companyName });
  await ProductModel.create({
    companyId: company._id,
    name: productName,
    description: 'A product',
    price: 100,
    category: 'General',
    imageUrl: 'https://example.com/product.png',
  });
  return company._id.toString();
}

describe('search_products tool tenant isolation', () => {
  it('does not expose a company/tenant parameter in its schema', () => {
    const properties = searchProductsTool.function.parameters?.properties as Record<string, unknown>;
    expect(Object.keys(properties)).toEqual(['query', 'category', 'minPrice', 'maxPrice']);
    expect(properties).not.toHaveProperty('companyId');
    expect(properties).not.toHaveProperty('company');
    expect(properties).not.toHaveProperty('tenantId');
  });

  it('only returns products belonging to the companyId in the execution context', async () => {
    const companyAId = await seedCompanyWithProduct('Company A', 'Company A Widget');
    await seedCompanyWithProduct('Company B', 'Company B Widget');

    const results = await executeSearchProducts({}, { companyId: companyAId });

    expect(results).toHaveLength(1);
    expect(results.at(0)?.name).toBe('Company A Widget');
  });

  it('ignores a companyId smuggled into the tool arguments by a manipulated prompt', async () => {
    const companyAId = await seedCompanyWithProduct('Company A', 'Company A Widget');
    const companyBId = await seedCompanyWithProduct('Company B', 'Company B Widget');

    // Simulates a model that was talked into passing a foreign tenant id as
    // if it were a legitimate filter — the tool has no such parameter, so
    // this can only work if the implementation reads args.companyId, which
    // it must not.
    const maliciousArgs: SearchProductsArgs & { companyId: string } = { companyId: companyBId };

    const results = await executeSearchProducts(maliciousArgs, { companyId: companyAId });

    expect(results).toHaveLength(1);
    expect(results.at(0)?.name).toBe('Company A Widget');
  });
});
