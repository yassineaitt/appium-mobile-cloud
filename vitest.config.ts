import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    include: ['tests/unit/**/*.spec.ts'],
    environment: 'node',
    globals: false,
  },
  resolve: {
    alias: {
      '@config': path.resolve(import.meta.dirname, 'config'),
      '@utils': path.resolve(import.meta.dirname, 'src/utils'),
    },
  },
});
