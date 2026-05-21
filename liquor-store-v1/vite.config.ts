import path from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { createUploadMiddleware } from './server/uploadProductImageHttp';

function r2UploadDevApi(): Plugin {
  return {
    name: 'r2-upload-dev-api',
    configureServer(server) {
      server.middlewares.use(createUploadMiddleware());
    },
  };
}

export default defineConfig({
  plugins: [react(), r2UploadDevApi()],
  resolve: {
    dedupe: ['react', 'react-dom', 'react-router-dom'],
    alias: {
      '@my-agency/admin-ui': path.resolve(__dirname, '../packages/admin-ui/src/index.ts'),
    },
  },
  server: {
    port: 3000,
    fs: {
      allow: ['..'],
    },
  },
});
