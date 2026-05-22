const { createRequire } = require('node:module');
const { join } = require('node:path');

let loaded = false;

function loadServerEnv() {
  if (loaded) {
    return;
  }
  loaded = true;

  if (process.env.VERCEL) {
    return;
  }

  try {
    const requireFromPkg = createRequire(join(process.cwd(), 'package.json'));
    const dotenv = requireFromPkg('dotenv');
    const cwd = process.cwd();
    dotenv.config({ path: join(cwd, '.env') });
    dotenv.config({ path: join(cwd, '..', '.env') });
    dotenv.config({ path: join(cwd, '..', 'supabase', '.env') });
  } catch {
    // optional for local dev
  }
}

module.exports = { loadServerEnv };
