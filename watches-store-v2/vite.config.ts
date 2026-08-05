import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

const requireDev = createRequire(import.meta.url);
const projectRoot = path.dirname(fileURLToPath(import.meta.url));

function checkoutDevApi(): Plugin {
  return {
    name: 'checkout-dev-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url ?? '';
        if (url.startsWith('/api/create-razorpay-order')) {
          const { loadServerEnv } = requireDev(path.join(projectRoot, 'api/_lib/loadServerEnv.js'));
          const { handleCreateRazorpayOrder } = requireDev(
            path.join(projectRoot, 'api/_lib/ordersHttp.js'),
          );
          loadServerEnv();
          void handleCreateRazorpayOrder(req, res);
          return;
        }
        if (url.startsWith('/api/verify-razorpay-payment')) {
          const { loadServerEnv } = requireDev(path.join(projectRoot, 'api/_lib/loadServerEnv.js'));
          const { handleVerifyRazorpayPayment } = requireDev(
            path.join(projectRoot, 'api/_lib/ordersHttp.js'),
          );
          loadServerEnv();
          void handleVerifyRazorpayPayment(req, res);
          return;
        }
        next();
      });
    },
  };
}

function r2UploadDevApi(): Plugin {
  return {
    name: 'r2-upload-dev-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith('/api/upload-product-image')) {
          next();
          return;
        }
        const { loadServerEnv } = requireDev(path.join(projectRoot, 'api/_lib/loadServerEnv.js'));
        const { handleUploadProductImage } = requireDev(
          path.join(projectRoot, 'api/_lib/uploadProductImageHttp.js'),
        );
        loadServerEnv();
        void handleUploadProductImage(req, res);
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), r2UploadDevApi(), checkoutDevApi()],
  resolve: {
    dedupe: ['react', 'react-dom', 'react-router-dom'],
    alias: {
      '@my-agency/admin-ui': path.resolve(__dirname, '../packages/admin-ui/src/index.ts'),
    },
  },
  server: {
    port: 3002,
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
          if (id.includes('node_modules/react-router')) {
            return 'router';
          }
          if (id.includes('node_modules/react-dom') || id.includes('node_modules/react/')) {
            return 'react-vendor';
          }
          return undefined;
        },
      },
    },
  },
});
