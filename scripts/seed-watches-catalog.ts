/**
 * Run once after applying Supabase migrations (from repo root):
 *   npm run seed:watches
 * Requires root `.env` with SUPABASE_URL + SUPABASE_SECRET_KEY.
 */
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { FEATURED_TOYS, FEATURED_WATCHES } from '../watches-store-v2/src/data/featured';
import { SUBCATEGORY_CATALOG } from '../watches-store-v2/src/data/subcategoryCatalog';
import type { SubcategoryCatalogKey } from '../watches-store-v2/src/types/catalogTile.types';

const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ??
  process.env.SUPABASE_SECRET_KEY;

if (!url || !serviceKey) {
  console.error('Set SUPABASE_URL and SUPABASE_SECRET_KEY (or SUPABASE_SERVICE_ROLE_KEY)');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

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
  const rows = [PR_WATCHES_CLIENT_ROW];

  const { error } = await supabase.from('clients').upsert(rows);
  if (error) {
    throw new Error(error.message);
  }
  console.log(`Seeded ${rows.length} clients`);
}

async function seedWatchesProducts(): Promise<void> {
  await supabase.from('products').delete().eq('client_id', WATCHES_CLIENT_ID);

  const productRows: Record<string, unknown>[] = [];
  let sort = 0;

  const subcategoryKeys = Object.keys(SUBCATEGORY_CATALOG) as SubcategoryCatalogKey[];
  for (const subcategory of subcategoryKeys) {
    for (const item of SUBCATEGORY_CATALOG[subcategory]) {
      productRows.push({
        client_id: WATCHES_CLIENT_ID,
        name: item.name,
        brand: item.brand,
        price_inr: item.priceInr,
        emi_price_inr: Math.max(1, Math.round(item.priceInr / 12)),
        image_url: item.image,
        in_stock: true,
        category: subcategory,
        subcategory,
        is_accessory: false,
        featured_group: null,
        featured_sort: null,
        sort_order: sort++,
      });
    }
  }

  const featuredNameSet = new Map<string, { group: 'watch' | 'toy'; sort: number }>();
  FEATURED_WATCHES.forEach((f, i) => {
    featuredNameSet.set(f.name.toLowerCase(), { group: 'watch', sort: i });
  });
  FEATURED_TOYS.forEach((f, i) => {
    featuredNameSet.set(f.name.toLowerCase(), { group: 'toy', sort: i });
  });

  for (const row of productRows) {
    const key = String(row.name).toLowerCase();
    const featured = featuredNameSet.get(key);
    if (featured) {
      row.featured_group = featured.group;
      row.featured_sort = featured.sort;
    }
  }

  const { error } = await supabase.from('products').insert(productRows);
  if (error) {
    throw new Error(error.message);
  }
  console.log(`Seeded ${productRows.length} products for ${WATCHES_CLIENT_ID}`);
}

async function main(): Promise<void> {
  await seedClients();
  await seedWatchesProducts();
  console.log('Done.');
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
