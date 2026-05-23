import path from 'node:path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

function r2UploadDevApi(): Plugin {
  return {
    name: 'r2-upload-dev-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith('/api/upload-product-image')) {
          next();
          return;
        }
        void import('./api/_lib/uploadProductImageHttp.js').then(({ handleUploadProductImage }) =>
          handleUploadProductImage(req, res),
        );
      });
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
    port: 5173,
    fs: {
      allow: ['..'],
    },
  },
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks(id: string): string | undefined {
          if (id.includes('packages/admin-ui')) {
            return 'admin-ui';
          }
          if (id.includes('node_modules/framer-motion')) {
            return 'motion';
          }
          if (id.includes('node_modules/@supabase')) {
            return 'supabase';
          }
          return undefined;
        },
      },
    },
  },
});
