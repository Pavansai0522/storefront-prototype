/**
 * Seed Aruna's Eagle restaurant client, store admin, and sample menu catalog.
 * Run from repo root: npm run seed:restaurant
 * Requires root `.env` with SUPABASE_URL + SUPABASE_SECRET_KEY.
 * Set SEED_FORCE=true to replace an existing catalog.
 */
import './load-env';
import { createClient } from '@supabase/supabase-js';
import { clientConfig } from '../restaurant-v1/src/config/client-config';
import { createSupabaseAdmin, seedProductsForClient } from './seed-client-catalogs';

const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;

const RESTAURANT_CLIENT_ID = 'client-restaurant-1';
const RESTAURANT_SLUG = 'arunas-eagle';
const STORE_ADMIN_EMAIL =
  process.env.RESTAURANT_STORE_ADMIN_EMAIL ?? clientConfig.email;
const STORE_ADMIN_PASSWORD =
  process.env.RESTAURANT_STORE_ADMIN_PASSWORD ?? 'Welcome#2026';

if (!url || !serviceKey) {
  const missing: string[] = [];
  if (!url) {
    missing.push('SUPABASE_URL or VITE_SUPABASE_URL');
  }
  if (!serviceKey) {
    missing.push('SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SECRET_KEY (service role — not the anon key)');
  }
  console.error(`Missing in root .env or supabase/.env: ${missing.join(', ')}`);
  console.error('Supabase Dashboard → Project Settings → API → service_role (secret)');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const fullAddress = `${clientConfig.address}, ${clientConfig.city}, ${clientConfig.state} ${clientConfig.pincode}`;

const RESTAURANT_CLIENT_ROW = {
  id: RESTAURANT_CLIENT_ID,
  slug: RESTAURANT_SLUG,
  country: 'IN',
  template: 'restaurant-v1',
  store_name: clientConfig.storeName,
  status: 'active',
  monthly_fee: 299,
  live_url: process.env.RESTAURANT_LIVE_URL ?? 'http://localhost:3003',
  whatsapp_number: `+${clientConfig.whatsappE164}`,
  store_phone: clientConfig.phonePrimary.replace(/\s/g, ''),
  address: fullAddress,
  primary_color: clientConfig.colors.primary,
  logo_url: clientConfig.logo ?? '',
  admin_email: STORE_ADMIN_EMAIL,
  admin_temp_password: '',
  admin_last_login_at: null,
  products_count: 0,
  products_last_updated_at: new Date().toISOString(),
  accessories_last_updated_at: null,
  site_active: true,
  billing: {
    planMonthlyInr: 299,
    paidUntil: '2026-12-31',
    nextDue: '2026-12-31',
    amount: 299,
    lastPaid: null,
    paymentHistory: [],
  },
  instagram: '',
  facebook: '',
  timings: clientConfig.timings.daily,
  age_verification_enabled: false,
  delivery_available: false,
  delivery_radius_miles: 0,
  minimum_order_amount_usd: 0,
  notes: [],
  public_config: {
    storeEmail: clientConfig.email,
    secondaryPhone: clientConfig.phoneSecondary,
  },
};

async function seedClient(): Promise<void> {
  const { error } = await supabase.from('clients').upsert(RESTAURANT_CLIENT_ROW);
  if (error) {
    throw new Error(error.message);
  }
  console.log(`Upserted client ${RESTAURANT_CLIENT_ID} (${RESTAURANT_SLUG})`);
}

async function seedStoreAdmin(): Promise<void> {
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
    client_id: RESTAURANT_CLIENT_ID,
    must_change_password: false,
  });

  if (profileError) {
    throw new Error(`profiles: ${profileError.message}`);
  }
  console.log(`Profile: role=admin, client_id=${RESTAURANT_CLIENT_ID}`);
}

async function main(): Promise<void> {
  await seedClient();
  await seedStoreAdmin();

  const admin = createSupabaseAdmin();
  const force = process.env.SEED_FORCE === 'true';
  await seedProductsForClient(
    admin,
    {
      id: RESTAURANT_CLIENT_ID,
      slug: RESTAURANT_SLUG,
      template: RESTAURANT_CLIENT_ROW.template,
      store_name: RESTAURANT_CLIENT_ROW.store_name,
    },
    { force },
  );

  console.log("\nAruna's Eagle ready.");
  console.log('  Storefront: http://localhost:3003 (npm run dev:restaurant)');
  console.log(`  Store admin: ${STORE_ADMIN_EMAIL} / ${STORE_ADMIN_PASSWORD}`);
  console.log('  Superadmin: your VITE_SUPERADMIN_EMAIL on any storefront /admin');
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
