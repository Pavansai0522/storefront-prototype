/**
 * Seed Bala Mobiles client, catalog, and store admin.
 * Run from repo root: npm run seed:bala
 * Requires root `.env` with SUPABASE_URL + SUPABASE_SECRET_KEY.
 */
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { PHONES } from '../client/src/data/phones';
import { ACCESSORY_ITEMS } from '../client/src/data/accessories';
import type { AccessoryCategoryId } from '../client/src/types/product.types';

const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;

const BALA_CLIENT_ID = 'client-bala-1';
const BALA_SLUG = 'bala-mobiles';
const STORE_ADMIN_EMAIL = process.env.BALA_STORE_ADMIN_EMAIL ?? 'owner@balamobiles.example';
const STORE_ADMIN_PASSWORD = process.env.BALA_STORE_ADMIN_PASSWORD ?? 'Welcome#2026';

const ADMIN_ACCESSORY_CATEGORY: Record<AccessoryCategoryId, string> = {
  audio: 'Earphone',
  cables: 'Cable',
  wearables: 'Other',
  power: 'Case',
};

if (!url || !serviceKey) {
  console.error('Set SUPABASE_URL and SUPABASE_SECRET_KEY in root .env');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const BALA_CLIENT_ROW = {
  id: BALA_CLIENT_ID,
  slug: BALA_SLUG,
  template: 'mobile-store-v1',
  store_name: 'Bala Mobiles',
  status: 'active',
  monthly_fee: 299,
  live_url: process.env.BALA_LIVE_URL ?? 'https://bala-mobiles.vercel.app',
  whatsapp_number: '+91 98765 43210',
  store_phone: '+91 98765 43210',
  address: 'Shop No. 42, Tech Market Building,\nMG Road, Near Metro Pillar 104,\nNew Delhi, 110001',
  primary_color: '#FF6B00',
  logo_url: '',
  admin_email: STORE_ADMIN_EMAIL,
  admin_temp_password: '',
  admin_last_login_at: null,
  products_count: 0,
  products_last_updated_at: new Date().toISOString(),
  accessories_last_updated_at: new Date().toISOString(),
  site_active: true,
  billing: {
    planMonthlyInr: 299,
    paidUntil: '2026-12-31',
    nextDue: '2026-12-31',
    amount: 299,
    lastPaid: null,
    paymentHistory: [],
  },
  instagram: '@balamobiles',
  facebook: 'balamobiles',
  timings: 'Mon–Sat 10:00–21:00 · Sun 11:00–20:00',
  age_verification_enabled: false,
  delivery_available: false,
  delivery_radius_miles: 0,
  minimum_order_amount_usd: 0,
  notes: [],
  public_config: { storeEmail: 'hello@balamobiles.in' },
};

async function seedClient(): Promise<void> {
  const { error } = await supabase.from('clients').upsert(BALA_CLIENT_ROW);
  if (error) {
    throw new Error(error.message);
  }
  console.log(`Upserted client ${BALA_CLIENT_ID} (${BALA_SLUG})`);
}

async function seedProducts(): Promise<void> {
  await supabase.from('products').delete().eq('client_id', BALA_CLIENT_ID);

  const productRows: Record<string, unknown>[] = [];
  let sort = 0;

  for (const phone of PHONES) {
    const emiNum = Number.parseInt(phone.emi.replace(/\D/g, ''), 10) || 0;
    productRows.push({
      client_id: BALA_CLIENT_ID,
      name: phone.name,
      brand: phone.brand,
      price_inr: phone.priceValue,
      emi_price_inr: emiNum > 0 ? emiNum : null,
      image_url: phone.img,
      in_stock: true,
      category: 'Phone',
      subcategory: null,
      is_accessory: false,
      featured_group: null,
      featured_sort: sort < 6 ? sort : null,
      sort_order: sort++,
    });
  }

  for (const item of ACCESSORY_ITEMS) {
    const adminCategory = ADMIN_ACCESSORY_CATEGORY[item.categoryId];
    productRows.push({
      client_id: BALA_CLIENT_ID,
      name: item.name,
      brand: item.itemCode,
      price_inr: item.priceValue,
      emi_price_inr: null,
      image_url: item.img,
      in_stock: true,
      category: adminCategory,
      subcategory: item.categoryId,
      is_accessory: true,
      featured_group: null,
      featured_sort: null,
      sort_order: sort++,
    });
  }

  const { error } = await supabase.from('products').insert(productRows);
  if (error) {
    throw new Error(error.message);
  }
  console.log(`Seeded ${productRows.length} products (${PHONES.length} phones, ${ACCESSORY_ITEMS.length} accessories)`);
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
    client_id: BALA_CLIENT_ID,
    must_change_password: false,
  });

  if (profileError) {
    throw new Error(`profiles: ${profileError.message}`);
  }
  console.log(`Profile: role=admin, client_id=${BALA_CLIENT_ID}`);
}

async function main(): Promise<void> {
  await seedClient();
  await seedProducts();
  await seedStoreAdmin();
  console.log('\nBala Mobiles ready.');
  console.log(`  Storefront: http://localhost:5173/admin`);
  console.log(`  Store admin: ${STORE_ADMIN_EMAIL}`);
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
