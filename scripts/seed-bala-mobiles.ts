/**
 * Seed Bala Mobiles client and store admin.
 * Products are managed in /admin — not seeded from mock files.
 * Run from repo root: npm run seed:bala
 * Requires root `.env` with SUPABASE_URL + SUPABASE_SECRET_KEY.
 */
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;

const BALA_CLIENT_ID = 'client-bala-1';
const BALA_SLUG = 'bala-mobiles';
const STORE_ADMIN_EMAIL = process.env.BALA_STORE_ADMIN_EMAIL ?? 'owner@balamobiles.example';
const STORE_ADMIN_PASSWORD = process.env.BALA_STORE_ADMIN_PASSWORD;

if (!STORE_ADMIN_PASSWORD) {
  console.error('Set BALA_STORE_ADMIN_PASSWORD in root .env before running seed:bala');
  process.exit(1);
}

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
  whatsapp_number: '+91 93931 15555',
  store_phone: '+91 93931 15555',
  address:
    'Bala Kumar — Sri Srinivasa Communications · Bala Digital Xpress\n9-7-255/13, Beside Malabar Gold Shop\nMain Road, Old Gajuwaka\nVisakhapatnam, Near Srikanya Theater\nPIN: 530026',
  primary_color: '#E31E24',
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
  instagram: 'https://www.instagram.com/bala_digital_xpress?igsh=cGRvNm50MHJiMHA4',
  facebook: 'https://www.facebook.com/bala.kumar.712161',
  timings: 'Mon–Sun 10:30–21:30',
  age_verification_enabled: false,
  delivery_available: false,
  delivery_radius_miles: 0,
  minimum_order_amount_usd: 0,
  notes: [],
  public_config: {
    mapsUrl: 'https://maps.app.goo.gl/5NT6NKrx3KnzMBvh9',
    youtubeUrl: 'https://youtube.com/user/vsvbalakumar',
    telegramUrl: 'https://t.me/bala2233',
    whatsappChannelUrl: 'https://whatsapp.com/channel/0029VaA45vC1t90XGjoulr3Q',
    instagramHandle: '@bala_digital_xpress',
    storeCarouselImages: [],
  },
};

async function seedClient(): Promise<void> {
  const { error } = await supabase.from('clients').upsert(BALA_CLIENT_ROW);
  if (error) {
    throw new Error(error.message);
  }
  console.log(`Upserted client ${BALA_CLIENT_ID} (${BALA_SLUG})`);
}

async function clearMockCatalog(): Promise<void> {
  if (process.env.BALA_CLEAR_MOCK_CATALOG !== 'true') {
    return;
  }

  const { data: rows, error: fetchError } = await supabase
    .from('products')
    .select('id, image_url')
    .eq('client_id', BALA_CLIENT_ID);

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  const mockIds = (rows ?? [])
    .filter((row) => {
      const imageUrl = row.image_url ?? '';
      return imageUrl.includes('unsplash.com') || imageUrl.length === 0;
    })
    .map((row) => row.id);

  if (mockIds.length === 0) {
    console.log('No mock catalog rows to remove.');
    return;
  }

  const { error: deleteError } = await supabase.from('products').delete().in('id', mockIds);
  if (deleteError) {
    throw new Error(deleteError.message);
  }
  console.log(`Removed ${mockIds.length} mock/placeholder products from catalog.`);
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
  await clearMockCatalog();
  await seedStoreAdmin();
  console.log('\nBala Mobiles ready.');
  console.log('  Storefront: http://localhost:5173');
  console.log('  Store admin: http://localhost:5173/admin');
  console.log(`  Admin login: ${STORE_ADMIN_EMAIL}`);
  console.log('  Add phones & accessories in /admin (no mock catalog is seeded).');
  if (process.env.BALA_CLEAR_MOCK_CATALOG !== 'true') {
    console.log('  Tip: set BALA_CLEAR_MOCK_CATALOG=true to delete Unsplash placeholder products.');
  }
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
