/**
 * Ensure superadmin + PR Watches store admin exist with correct profiles.
 * Uses root .env for superadmin; store admin from env or defaults below.
 *
 * Run:
 *   npm run ensure:pr-watches-users
 *
 * Optional root .env overrides:
 *   STORE_ADMIN_EMAIL=prwatchesv1@gmail.com
 *   STORE_ADMIN_PASSWORD=your-password
 */
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;

const SUPERADMIN_EMAIL = process.env.SUPERADMIN_EMAIL ?? 'super@agency.com';
const SUPERADMIN_PASSWORD = process.env.SUPERADMIN_PASSWORD ?? 'Agency#2026!';
const STORE_ADMIN_EMAIL = process.env.STORE_ADMIN_EMAIL ?? 'prwatchesv1@gmail.com';
const STORE_ADMIN_PASSWORD = process.env.STORE_ADMIN_PASSWORD ?? 'Welcome#2026';
const CLIENT_ID = 'client-watches-1';

/** Legacy demo account — removed when present. */
const LEGACY_STORE_EMAIL = 'owner@prwatches.example';

if (!url || !serviceKey) {
  console.error('Set SUPABASE_URL and SUPABASE_SECRET_KEY in root .env');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function findUserByEmail(email: string): Promise<string | undefined> {
  const { data, error } = await supabase.auth.admin.listUsers();
  if (error) {
    throw new Error(error.message);
  }
  return data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase())?.id;
}

async function ensureUser(
  email: string,
  password: string,
  role: 'superadmin' | 'admin',
  clientId: string | null,
): Promise<void> {
  let userId = await findUserByEmail(email);
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
    const { error } = await supabase.auth.admin.updateUserById(userId, { password });
    if (error) {
      throw new Error(`updateUser ${email}: ${error.message}`);
    }
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
  console.log(`  profile: role=${role}, client_id=${clientId ?? 'null'}`);
}

async function deleteUserIfExists(email: string): Promise<void> {
  const userId = await findUserByEmail(email);
  if (!userId) {
    return;
  }
  const { error } = await supabase.auth.admin.deleteUser(userId);
  if (error) {
    throw new Error(`deleteUser ${email}: ${error.message}`);
  }
  console.log(`Removed legacy auth user ${email}`);
}

async function main(): Promise<void> {
  const { data: client, error: clientError } = await supabase
    .from('clients')
    .select('id, store_name')
    .eq('id', CLIENT_ID)
    .maybeSingle();
  if (clientError) {
    throw new Error(clientError.message);
  }
  if (!client) {
    throw new Error(`Client ${CLIENT_ID} missing — run npm run seed:watches`);
  }

  console.log(`Store: ${client.store_name} (${CLIENT_ID})\n`);

  console.log('Superadmin…');
  await ensureUser(SUPERADMIN_EMAIL, SUPERADMIN_PASSWORD, 'superadmin', null);

  console.log('\nPR Watches store admin…');
  await ensureUser(STORE_ADMIN_EMAIL, STORE_ADMIN_PASSWORD, 'admin', CLIENT_ID);

  console.log('\nLegacy cleanup…');
  await deleteUserIfExists(LEGACY_STORE_EMAIL);

  console.log('\nDone. Sign in at admin with either account above.');
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
