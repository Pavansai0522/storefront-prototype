import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom', 'react-router-dom'],
    alias: {
      '@my-agency/admin-ui': path.resolve(__dirname, '../packages/admin-ui/src/index.ts'),
      '@my-agency/admin-ui/styles.css': path.resolve(
        __dirname,
        '../packages/admin-ui/src/styles/admin.css',
      ),
    },
  },
  server: {
    port: 5174,
    fs: {
      allow: ['..'],
    },
  },
});
