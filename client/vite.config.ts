import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
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
