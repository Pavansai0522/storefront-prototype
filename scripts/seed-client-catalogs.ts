import './load-env';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { liquorCatalogItems } from './seed-data/liquor-catalog';
import { mobileCatalogItems } from './seed-data/mobile-catalog';
import { toDbProductRows, type ProductSeedItem } from './seed-data/types';
import { watchesCatalogItems } from './seed-data/watches-catalog';

export type ClientRow = {
  id: string;
  slug: string;
  template: string;
  store_name: string;
};

export type SeedCatalogOptions = {
  /** Replace existing products for the client. Default: false (skip when catalog already has rows). */
  force?: boolean;
};

function catalogItemsForTemplate(template: string): ProductSeedItem[] | null {
  if (template.startsWith('mobile-store')) {
    return mobileCatalogItems();
  }
  if (template.startsWith('liquor-store')) {
    return liquorCatalogItems();
  }
  if (template === 'watches-store-v2') {
    return watchesCatalogItems();
  }
  return null;
}

export function createSupabaseAdmin(): SupabaseClient {
  const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      'Set SUPABASE_URL and SUPABASE_SECRET_KEY (or SUPABASE_SERVICE_ROLE_KEY) in root .env',
    );
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function countClientProducts(
  supabase: SupabaseClient,
  clientId: string,
): Promise<number> {
  const { count, error } = await supabase
    .from('products')
    .select('id', { count: 'exact', head: true })
    .eq('client_id', clientId);

  if (error) {
    throw new Error(error.message);
  }
  return count ?? 0;
}

export async function seedProductsForClient(
  supabase: SupabaseClient,
  client: ClientRow,
  options: SeedCatalogOptions = {},
): Promise<{ seeded: number; skipped: boolean }> {
  const items = catalogItemsForTemplate(client.template);
  if (!items) {
    console.log(`  Skip ${client.store_name} (${client.id}): unsupported template "${client.template}"`);
    return { seeded: 0, skipped: true };
  }

  const existing = await countClientProducts(supabase, client.id);
  if (existing > 0 && !options.force) {
    console.log(
      `  Skip ${client.store_name} (${client.id}): ${existing} products already exist (use SEED_FORCE=true to replace)`,
    );
    return { seeded: 0, skipped: true };
  }

  if (existing > 0) {
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('client_id', client.id);
    if (deleteError) {
      throw new Error(deleteError.message);
    }
  }

  const rows = toDbProductRows(client.id, items);
  const { error: insertError } = await supabase.from('products').insert(rows);
  if (insertError) {
    throw new Error(insertError.message);
  }

  const now = new Date().toISOString();
  const accessoryCount = items.filter((item) => item.isAccessory).length;
  const { error: clientError } = await supabase
    .from('clients')
    .update({
      products_count: rows.length,
      products_last_updated_at: now,
      accessories_last_updated_at: accessoryCount > 0 ? now : null,
    })
    .eq('id', client.id);

  if (clientError) {
    throw new Error(clientError.message);
  }

  console.log(`  Seeded ${rows.length} products for ${client.store_name} (${client.template})`);
  return { seeded: rows.length, skipped: false };
}

export async function seedAllClientCatalogs(
  supabase: SupabaseClient,
  options: SeedCatalogOptions = {},
): Promise<void> {
  const { data: clients, error } = await supabase
    .from('clients')
    .select('id, slug, template, store_name')
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  if (!clients?.length) {
    console.log('No clients found. Run seed:bala, seed:liquor, or seed:watches first.');
    return;
  }

  console.log(`Seeding catalogs for ${clients.length} client(s)…`);
  let totalSeeded = 0;
  for (const client of clients as ClientRow[]) {
    const result = await seedProductsForClient(supabase, client, options);
    totalSeeded += result.seeded;
  }
  console.log(`Done. ${totalSeeded} product(s) inserted across all clients.`);
}

async function main(): Promise<void> {
  const force = process.env.SEED_FORCE === 'true';
  const supabase = createSupabaseAdmin();
  await seedAllClientCatalogs(supabase, { force });
}

const isDirectRun = process.argv[1]?.includes('seed-client-catalogs');
if (isDirectRun) {
  main().catch((err: unknown) => {
    console.error(err);
    process.exit(1);
  });
}
