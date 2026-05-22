import { createRequire } from 'node:module';
import { join } from 'node:path';

let loaded = false;

/** Load .env files for local dev only. On Vercel, env vars are injected — skip dotenv. */
export function loadServerEnv(): void {
  if (loaded) {
    return;
  }
  loaded = true;

  if (process.env.VERCEL) {
    return;
  }

  try {
    const require = createRequire(join(process.cwd(), 'package.json'));
    const dotenv = require('dotenv') as {
      config: (options: { path: string }) => void;
    };
    const cwd = process.cwd();
    dotenv.config({ path: join(cwd, '.env') });
    dotenv.config({ path: join(cwd, '..', '.env') });
    dotenv.config({ path: join(cwd, '..', 'supabase', '.env') });
  } catch {
    // dotenv is optional; local dev can rely on shell env instead
  }
}
