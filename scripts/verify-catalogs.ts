/**
 * Quick smoke test: products readable from Supabase (same as storefronts).
 * Run: npx tsx scripts/verify-catalogs.ts
 */
import './load-env';

const url = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL;
const key =
  process.env.VITE_SUPABASE_ANON_KEY ??
  process.env.SUPABASE_PUBLISHABLE_KEY ??
  process.env.SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('Missing Supabase URL or anon key in .env');
  process.exit(1);
}

const clients = [
  { id: 'client-bala-1', name: 'Bala Mobiles', template: 'mobile-store-v1' },
  { id: 'client-watches-1', name: 'PR Watches', template: 'watches-store-v2' },
  { id: 'client-liquor-1', name: 'United Liquors', template: 'liquor-store-v1' },
];

async function main(): Promise<void> {
  let ok = true;
  for (const client of clients) {
    const endpoint =
      `${url}/rest/v1/products?client_id=eq.${client.id}` +
      '&select=name,brand,category,is_accessory,in_stock&order=sort_order';
    const res = await fetch(endpoint, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    const rows = (await res.json()) as unknown;
    if (!res.ok || !Array.isArray(rows)) {
      console.error(`FAIL ${client.name}: HTTP ${res.status}`, rows);
      ok = false;
      continue;
    }
    const phones = rows.filter((r: { is_accessory: boolean }) => !r.is_accessory);
    const accessories = rows.filter((r: { is_accessory: boolean }) => r.is_accessory);
    console.log(
      `OK ${client.name}: ${rows.length} total (${phones.length} main, ${accessories.length} accessories)`,
    );
    if (rows.length < 5) {
      console.error(`  WARN: expected sample catalog (5+), only ${rows.length}`);
      ok = false;
    }
    const sample = rows.slice(0, 3) as { brand: string; name: string }[];
    console.log(`  → ${sample.map((r) => `${r.brand} ${r.name}`).join(' | ')}`);
  }

  const storefronts = [
    { name: 'Bala', url: 'http://localhost:5173/' },
    { name: 'Watches', url: 'http://localhost:3002/' },
    { name: 'Liquor', url: 'http://localhost:3000/' },
  ];
  console.log('\nStorefront HTTP check:');
  for (const store of storefronts) {
    try {
      const res = await fetch(store.url, { signal: AbortSignal.timeout(5000) });
      console.log(`  ${store.name} ${store.url} → ${res.status} ${res.ok ? 'OK' : 'FAIL'}`);
      if (!res.ok) ok = false;
    } catch (err) {
      console.error(`  ${store.name} ${store.url} → unreachable (${err instanceof Error ? err.message : err})`);
      ok = false;
    }
  }

  process.exit(ok ? 0 : 1);
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
