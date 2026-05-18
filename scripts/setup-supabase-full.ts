/**
 * One-shot Supabase bootstrap (cloud project required).
 *
 * 1. Create a project at https://supabase.com
 * 2. Run both SQL files in supabase/migrations/ via SQL Editor (or `npx supabase db push` after linking)
 * 3. Add root `.env`:
 *      SUPABASE_URL=https://xxx.supabase.co
 *      SUPABASE_SERVICE_ROLE_KEY=eyJ...
 * 4. Run: npm run setup:supabase
 */
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { execSync } from 'node:child_process';

const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;

if (!url || !serviceKey) {
  console.error(
    'Missing SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in root .env (see .env.example).',
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const superadminEmail = process.env.SUPERADMIN_EMAIL ?? 'super@agency.com';
const superadminPassword = process.env.SUPERADMIN_PASSWORD ?? 'Agency#2026!';

const USERS = [
  {
    email: superadminEmail,
    password: superadminPassword,
    role: 'superadmin' as const,
    clientId: null as string | null,
  },
  {
    email: 'owner@prwatches.example',
    password: process.env.STORE_ADMIN_PASSWORD ?? 'Welcome#2026',
    role: 'admin' as const,
    clientId: 'client-watches-1',
  },
];

async function ensureUser(
  email: string,
  password: string,
  role: 'superadmin' | 'admin',
  clientId: string | null,
): Promise<void> {
  const { data: list } = await supabase.auth.admin.listUsers();
  const existing = list.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());

  let userId = existing?.id;
  if (!userId) {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (error) {
      throw new Error(`createUser ${email}: ${error.message}`);
    }
    userId = data.user.id;
    console.log(`Created auth user ${email}`);
  } else {
    await supabase.auth.admin.updateUserById(userId, { password });
    console.log(`Updated password for ${email}`);
  }

  const { error: profileError } = await supabase.from('profiles').upsert({
    id: userId,
    email,
    role,
    client_id: clientId,
    must_change_password: false,
  });
  if (profileError) {
    throw new Error(`profiles ${email}: ${profileError.message}`);
  }
}

async function writeEnvFiles(): Promise<void> {
  const anonKey =
    process.env.VITE_SUPABASE_ANON_KEY ??
    process.env.SUPABASE_ANON_KEY ??
    process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!anonKey) {
    console.warn(
      'Skip writing admin/watches .env — set VITE_SUPABASE_ANON_KEY in root .env to auto-generate.',
    );
    return;
  }
  const adminEnv = `VITE_SUPABASE_URL=${url}\nVITE_SUPABASE_ANON_KEY=${anonKey}\n`;
  const watchesEnv = `${adminEnv}VITE_CLIENT_SLUG=pr-watches-gadgets\nVITE_CLIENT_ID=client-watches-1\n`;
  const fs = await import('node:fs');
  fs.writeFileSync('admin/.env', adminEnv);
  fs.writeFileSync('watches-store-v2/.env', watchesEnv);
  console.log('Wrote admin/.env and watches-store-v2/.env');
}

async function main(): Promise<void> {
  console.log('Seeding catalog…');
  execSync('npm run seed:watches', { stdio: 'inherit', env: process.env });

  for (const u of USERS) {
    await ensureUser(u.email, u.password, u.role, u.clientId);
  }

  await writeEnvFiles();

  console.log('\nSetup complete.');
  console.log('Sign in at http://localhost:5174');
  console.log(`  ${superadminEmail} / (your SUPERADMIN_PASSWORD)`);
  console.log('  owner@prwatches.example / Welcome#2026');
  console.log('Watches store: http://localhost:3002');
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
