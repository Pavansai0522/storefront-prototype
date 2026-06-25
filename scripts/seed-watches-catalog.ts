/**
 * Run once after applying Supabase migrations (from repo root):
 *   npm run seed:watches
 * Requires root `.env` with SUPABASE_URL + SUPABASE_SECRET_KEY.
 */
import './load-env';
import { createSupabaseAdmin, seedProductsForClient } from './seed-client-catalogs';

const WATCHES_CLIENT_ID = 'client-watches-1';

const PR_WATCHES_CLIENT_ROW = {
  id: WATCHES_CLIENT_ID,
  slug: 'pr-watches-gadgets',
  template: 'watches-store-v2',
  store_name: 'PR Watches & Gadgets',
  status: 'active',
  monthly_fee: 299,
  live_url: 'http://localhost:3002',
  whatsapp_number: '+91 74169 58315',
  store_phone: '',
  address: 'Chilakaluripet, Andhra Pradesh 522616',
  primary_color: '#6C3FE8',
  logo_url: '',
  admin_email: '',
  admin_temp_password: '',
  admin_last_login_at: null,
  products_count: 0,
  products_last_updated_at: null,
  accessories_last_updated_at: null,
  site_active: true,
  billing: {
    planMonthlyInr: 299,
    paidUntil: '2026-06-14',
    nextDue: '2026-06-14',
    amount: 299,
    lastPaid: '2026-05-14',
    paymentHistory: [],
  },
  instagram: '@prwatchesgadgets',
  facebook: 'facebook.com/prwatchesgadgets',
  timings: 'Mon–Sat 10:00–21:00 · Sun 11:00–20:00',
  age_verification_enabled: false,
  delivery_available: false,
  delivery_radius_miles: 0,
  minimum_order_amount_usd: 0,
  notes: [],
  public_config: {},
};

async function seedClients(): Promise<void> {
  const supabase = createSupabaseAdmin();
  const { error } = await supabase.from('clients').upsert(PR_WATCHES_CLIENT_ROW);
  if (error) {
    throw new Error(error.message);
  }
  console.log('Seeded PR Watches client');
}

async function main(): Promise<void> {
  const supabase = createSupabaseAdmin();
  const force = process.env.SEED_FORCE === 'true';

  await seedClients();
  await seedProductsForClient(
    supabase,
    {
      id: WATCHES_CLIENT_ID,
      slug: PR_WATCHES_CLIENT_ROW.slug,
      template: PR_WATCHES_CLIENT_ROW.template,
      store_name: PR_WATCHES_CLIENT_ROW.store_name,
    },
    { force },
  );
  console.log('Done.');
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
