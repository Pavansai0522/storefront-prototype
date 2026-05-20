/**
 * Seed United Liquors client, catalog, and store admin.
 * Run from repo root: npm run seed:liquor
 * Requires root `.env` with SUPABASE_URL + SUPABASE_SECRET_KEY.
 */
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { dollarsToCents } from '../packages/admin-ui/src/constants/countryCurrency';
import { allProducts } from '../liquor-store-v1/src/data/products';
import { clientConfig } from '../liquor-store-v1/src/config/client-config';

const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;

const LIQUOR_CLIENT_ID = 'client-liquor-1';
const LIQUOR_SLUG = 'united-liquors';
const STORE_ADMIN_EMAIL =
  process.env.LIQUOR_STORE_ADMIN_EMAIL ?? 'info@unitedliquors.com';
const STORE_ADMIN_PASSWORD =
  process.env.LIQUOR_STORE_ADMIN_PASSWORD ?? 'Welcome#2026';

if (!url || !serviceKey) {
  console.error('Set SUPABASE_URL and SUPABASE_SECRET_KEY in root .env');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const LIQUOR_CLIENT_ROW = {
  id: LIQUOR_CLIENT_ID,
  slug: LIQUOR_SLUG,
  country: 'US',
  template: 'liquor-store-v1',
  store_name: clientConfig.storeName,
  status: 'active',
  monthly_fee: 299,
  live_url: process.env.LIQUOR_LIVE_URL ?? 'https://united-liquors.vercel.app',
  whatsapp_number: '',
  store_phone: clientConfig.phone,
  address: `${clientConfig.address}, ${clientConfig.city}, ${clientConfig.state} ${clientConfig.zipCode}`,
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
  instagram: clientConfig.social.instagram ?? '',
  facebook: clientConfig.social.facebook ?? '',
  timings: clientConfig.timings.weekdays,
  age_verification_enabled: clientConfig.ageGate,
  delivery_available: clientConfig.delivery.available,
  delivery_radius_miles: clientConfig.delivery.radiusMiles,
  minimum_order_amount_usd: clientConfig.delivery.minimumOrder,
  notes: [],
  public_config: { storeEmail: clientConfig.email },
};

async function seedClient(): Promise<void> {
  const { error } = await supabase.from('clients').upsert(LIQUOR_CLIENT_ROW);
  if (error) {
    throw new Error(error.message);
  }
  console.log(`Upserted client ${LIQUOR_CLIENT_ID} (${LIQUOR_SLUG})`);
}

async function seedProducts(): Promise<void> {
  await supabase.from('products').delete().eq('client_id', LIQUOR_CLIENT_ID);

  const productRows: Record<string, unknown>[] = [];
  let sort = 0;

  let dealSort = 0;
  for (const p of allProducts) {
    const isDeal = p.badge === 'DEAL';
    productRows.push({
      client_id: LIQUOR_CLIENT_ID,
      name: p.name,
      brand: p.brand,
      price_inr: dollarsToCents(p.price),
      emi_price_inr: null,
      image_url: p.image,
      in_stock: p.inStock !== false,
      category: p.category,
      subcategory: p.category,
      is_accessory: false,
      featured_group: isDeal ? 'deal' : null,
      featured_sort: isDeal ? dealSort++ : null,
      sort_order: sort++,
    });
  }

  const { error } = await supabase.from('products').insert(productRows);
  if (error) {
    throw new Error(error.message);
  }
  console.log(`Seeded ${productRows.length} products for ${LIQUOR_CLIENT_ID}`);
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
    client_id: LIQUOR_CLIENT_ID,
    must_change_password: false,
  });

  if (profileError) {
    throw new Error(`profiles: ${profileError.message}`);
  }
  console.log(`Profile: role=admin, client_id=${LIQUOR_CLIENT_ID}`);
}

async function main(): Promise<void> {
  await seedClient();
  await seedProducts();
  await seedStoreAdmin();
  console.log('\nUnited Liquors ready.');
  console.log('  Storefront: /admin on your liquor Vercel URL');
  console.log(`  Store admin: ${STORE_ADMIN_EMAIL} / ${STORE_ADMIN_PASSWORD}`);
  console.log('  Superadmin: your VITE_SUPERADMIN_EMAIL on any storefront /admin');
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
