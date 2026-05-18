/**
 * Delete known admin auth users + profiles, then recreate via setup:supabase.
 * Run: npm run reset:admin-auth
 */
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { execSync } from 'node:child_process';

const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;

if (!url || !serviceKey) {
  console.error('Missing SUPABASE_URL and SUPABASE_SECRET_KEY in root .env');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const EMAILS_TO_RESET = [
  process.env.SUPERADMIN_EMAIL ?? 'super@agency.com',
  'owner@prwatches.example',
  'super@agency.com',
];

async function listAllUsers(): Promise<{ id: string; email: string | undefined }[]> {
  const users: { id: string; email: string | undefined }[] = [];
  let page = 1;
  const perPage = 200;
  for (;;) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) {
      throw new Error(error.message);
    }
    users.push(...data.users.map((u) => ({ id: u.id, email: u.email })));
    if (data.users.length < perPage) {
      break;
    }
    page += 1;
  }
  return users;
}

async function main(): Promise<void> {
  const targets = new Set(EMAILS_TO_RESET.map((e) => e.trim().toLowerCase()));
  const all = await listAllUsers();
  const toDelete = all.filter((u) => u.email && targets.has(u.email.toLowerCase()));

  if (toDelete.length === 0) {
    console.log('No matching auth users to delete (will create fresh on setup).');
  }

  for (const user of toDelete) {
    const { error } = await supabase.auth.admin.deleteUser(user.id);
    if (error) {
      throw new Error(`deleteUser ${user.email}: ${error.message}`);
    }
    console.log(`Deleted auth user ${user.email} (profile cascades)`);
  }

  console.log('\nRecreating users and syncing .env files…\n');
  execSync('npm run setup:supabase', { stdio: 'inherit', env: process.env });

  console.log('\nAuth reset complete.');
  console.log('In the browser: sign out, clear localStorage key admin_impersonate_client_id, then sign in again.');
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
