/**
 * Ensures the superadmin auth user has profiles.role = 'superadmin' and client_id = null.
 * Run: npm run fix:superadmin-profile
 */
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;
const email = process.env.SUPERADMIN_EMAIL ?? 'super@agency.com';

if (!url || !serviceKey) {
  console.error('Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in root .env');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function main(): Promise<void> {
  const { data: list, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) {
    throw new Error(listError.message);
  }

  const user = list.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
  if (!user) {
    console.error(`No auth user found for ${email}. Run npm run setup:supabase first.`);
    process.exit(1);
  }

  const { error: profileError } = await supabase.from('profiles').upsert({
    id: user.id,
    email,
    role: 'superadmin',
    client_id: null,
    must_change_password: false,
  });

  if (profileError) {
    throw new Error(profileError.message);
  }

  console.log(`Fixed profile for ${email}: role=superadmin, client_id=null`);
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
