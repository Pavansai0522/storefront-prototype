/**
 * Load repo root `.env`, then `supabase/.env` (fills in vars missing from root).
 */
import { config } from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

config({ path: path.join(repoRoot, '.env') });
config({ path: path.join(repoRoot, 'supabase', '.env') });
