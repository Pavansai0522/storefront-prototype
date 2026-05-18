/**
 * Create or update PR Watches store admin (owner@prwatches.example).
 * Run: npm run create:store-admin
 */
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;

const STORE_ADMIN_EMAIL = 'owner@prwatches.example';
const STORE_ADMIN_PASSWORD = process.env.STORE_ADMIN_PASSWORD ?? 'Welcome#2026';
const CLIENT_ID = 'client-watches-1';

if (!url || !serviceKey) {
  console.error('Set SUPABASE_URL and SUPABASE_SECRET_KEY in root .env');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

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
    throw new Error(`Client ${CLIENT_ID} not found. Run npm run seed:watches first.`);
  }

  const { data: list } = await supabase.auth.admin.listUsers();
  const existing = list.users.find(
    (u) => u.email?.toLowerCase() === STORE_ADMIN_EMAIL.toLowerCase(),
  );

  let userId = existing?.id;
  if (!userId) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: STORE_ADMIN_EMAIL,
      password: STORE_ADMIN_PASSWORD,
      email_confirm: true,
    });
    if (error) {
      throw new Error(`createUser: ${error.message}`);
    }
    userId = data.user.id;
    console.log(`Created auth user ${STORE_ADMIN_EMAIL}`);
  } else {
    const { error } = await supabase.auth.admin.updateUserById(userId, {
      password: STORE_ADMIN_PASSWORD,
    });
    if (error) {
      throw new Error(`updateUser: ${error.message}`);
    }
    console.log(`Updated password for ${STORE_ADMIN_EMAIL}`);
  }

  const { error: profileError } = await supabase.from('profiles').upsert({
    id: userId,
    email: STORE_ADMIN_EMAIL,
    role: 'admin',
    client_id: CLIENT_ID,
    must_change_password: false,
  });

  if (profileError) {
    throw new Error(`profiles: ${profileError.message}`);
  }

  console.log(`Profile: role=admin, client_id=${CLIENT_ID} (${client.store_name})`);
  console.log('\nSign in at admin →');
  console.log(`  ${STORE_ADMIN_EMAIL}`);
  console.log(`  Password: (STORE_ADMIN_PASSWORD in root .env, default Welcome#2026)`);
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
