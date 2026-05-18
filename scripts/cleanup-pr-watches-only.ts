/**
 * Step 1 cleanup: keep only PR Watches in DB + two auth accounts.
 *
 * Keeps:
 *   - clients row: client-watches-1
 *   - products for client-watches-1
 *   - auth: SUPERADMIN_EMAIL + owner@prwatches.example
 *
 * Removes:
 *   - all other clients (products cascade)
 *   - all other auth users (profiles cascade)
 *
 * Run: npm run cleanup:pr-watches-only
 * Dry run: npm run cleanup:pr-watches-only -- --dry-run
 */
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;

const dryRun = process.argv.includes('--dry-run');

const KEEP_CLIENT_ID = 'client-watches-1';
const SUPERADMIN_EMAIL = process.env.SUPERADMIN_EMAIL ?? 'super@agency.com';
const STORE_ADMIN_EMAIL = process.env.STORE_ADMIN_EMAIL ?? 'prwatchesv1@gmail.com';
const KEEP_AUTH_EMAILS = new Set(
  [SUPERADMIN_EMAIL, STORE_ADMIN_EMAIL].map((e) => e.trim().toLowerCase()),
);

if (!url || !serviceKey) {
  console.error('Set SUPABASE_URL and SUPABASE_SECRET_KEY in root .env');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function listAllAuthUsers(): Promise<{ id: string; email: string }[]> {
  const users: { id: string; email: string }[] = [];
  let page = 1;
  const perPage = 200;
  for (;;) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) {
      throw new Error(error.message);
    }
    for (const u of data.users) {
      if (u.email) {
        users.push({ id: u.id, email: u.email });
      }
    }
    if (data.users.length < perPage) {
      break;
    }
    page += 1;
  }
  return users;
}

async function main(): Promise<void> {
  console.log(dryRun ? '=== DRY RUN (no deletes) ===\n' : '=== LIVE CLEANUP ===\n');
  console.log(`Keep client: ${KEEP_CLIENT_ID}`);
  console.log(`Keep auth emails: ${[...KEEP_AUTH_EMAILS].join(', ')}\n`);

  // Step 1 — clients
  console.log('Step 1: Remove extra clients…');
  const { data: clients, error: clientsError } = await supabase
    .from('clients')
    .select('id, store_name, slug');
  if (clientsError) {
    throw new Error(clientsError.message);
  }

  const toDeleteClients = (clients ?? []).filter((c) => c.id !== KEEP_CLIENT_ID);
  if (toDeleteClients.length === 0) {
    console.log('  No extra clients to delete.');
  } else {
    for (const c of toDeleteClients) {
      console.log(`  - delete client ${c.id} (${c.store_name})`);
      if (!dryRun) {
        const { error } = await supabase.from('clients').delete().eq('id', c.id);
        if (error) {
          throw new Error(`delete client ${c.id}: ${error.message}`);
        }
      }
    }
  }

  const { count: productCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('client_id', KEEP_CLIENT_ID);
  console.log(`  Products left for ${KEEP_CLIENT_ID}: ${productCount ?? 0}\n`);

  // Step 2 — auth users
  console.log('Step 2: Remove extra auth users…');
  const authUsers = await listAllAuthUsers();
  const toDeleteAuth = authUsers.filter((u) => !KEEP_AUTH_EMAILS.has(u.email.toLowerCase()));

  if (toDeleteAuth.length === 0) {
    console.log('  No extra auth users to delete.');
  } else {
    for (const u of toDeleteAuth) {
      console.log(`  - delete auth ${u.email}`);
      if (!dryRun) {
        const { error } = await supabase.auth.admin.deleteUser(u.id);
        if (error) {
          throw new Error(`delete auth ${u.email}: ${error.message}`);
        }
      }
    }
  }

  // Step 3 — verify kept profiles
  console.log('\nStep 3: Verify kept profiles…');
  const keptUsers = authUsers.filter((u) => KEEP_AUTH_EMAILS.has(u.email.toLowerCase()));
  for (const u of keptUsers) {
    const role = u.email.toLowerCase() === SUPERADMIN_EMAIL.toLowerCase() ? 'superadmin' : 'admin';
    const clientId = role === 'superadmin' ? null : KEEP_CLIENT_ID;
    console.log(`  - ${u.email} → role=${role}, client_id=${clientId ?? 'null'}`);
    if (!dryRun) {
      const { error } = await supabase.from('profiles').upsert({
        id: u.id,
        email: u.email,
        role,
        client_id: clientId,
        must_change_password: false,
      });
      if (error) {
        throw new Error(`profiles ${u.email}: ${error.message}`);
      }
    }
  }

  // Summary
  const { data: remainingClients } = await supabase.from('clients').select('id, store_name');
  const remainingAuth = dryRun
    ? authUsers.filter((u) => KEEP_AUTH_EMAILS.has(u.email.toLowerCase()))
    : await listAllAuthUsers();

  console.log('\n=== Done ===');
  console.log('Clients:', (remainingClients ?? []).map((c) => c.id).join(', ') || '(none)');
  console.log('Auth:', remainingAuth.map((u) => u.email).join(', ') || '(none)');
  if (dryRun) {
    console.log('\nRe-run without --dry-run to apply.');
  }
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
