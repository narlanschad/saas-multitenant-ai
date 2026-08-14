import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globalSetup: './tests/globalSetup.ts',
    hookTimeout: 30000,
    testTimeout: 15000,
    // All test files share one in-memory MongoDB instance (see globalSetup),
    // so running files in parallel lets one file's afterEach(clearTestDb)
    // wipe data another file's test just inserted. Sequential files avoid that.
    fileParallelism: false,
  },
});
