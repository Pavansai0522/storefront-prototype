import { config } from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const liquorRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const repoRoot = path.resolve(liquorRoot, '..');

let loaded = false;

/** Load .env files for Vite dev middleware and local API testing. No-op on Vercel (env injected). */
export function loadServerEnv(): void {
  if (loaded) {
    return;
  }
  config({ path: path.join(repoRoot, '.env') });
  config({ path: path.join(liquorRoot, '.env') });
  config({ path: path.join(repoRoot, 'supabase', '.env') });
  loaded = true;
}
