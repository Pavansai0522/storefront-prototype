/**
 * Copy existing Supabase Storage product images to Cloudflare R2 and update products.image_url.
 *
 * Run from repo root (after R2 bucket + public URL are configured):
 *   npm run migrate:liquor-images
 *
 * Requires: supabase/.env or root .env (Supabase service role) + R2_* variables.
 */
import './load-env';
import { createClient } from '@supabase/supabase-js';
import { putProductImage } from '../liquor-store-v1/api/_lib/r2Client';
import { loadR2Config, publicUrlForPath, storagePathForProduct } from './lib/r2MigrateEnv';

const LIQUOR_CLIENT_ID = process.env.VITE_CLIENT_ID ?? 'client-liquor-1';

const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;

if (!url || !serviceKey) {
  console.error('Missing Supabase service credentials.');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

function isSupabaseStorageUrl(imageUrl: string): boolean {
  return imageUrl.includes('/storage/v1/object/public/product-images/');
}

function storagePathFromSupabaseUrl(imageUrl: string): string | null {
  const marker = '/storage/v1/object/public/product-images/';
  const index = imageUrl.indexOf(marker);
  if (index === -1) {
    return null;
  }
  return decodeURIComponent(imageUrl.slice(index + marker.length));
}

async function main(): Promise<void> {
  const r2 = loadR2Config();
  console.log(`R2 bucket: ${r2.bucketName}`);
  console.log(`Public base: ${r2.publicBaseUrl}`);

  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, image_url')
    .eq('client_id', LIQUOR_CLIENT_ID);

  if (error) {
    throw new Error(error.message);
  }

  const rows = (products ?? []).filter(
    (p) => typeof p.image_url === 'string' && p.image_url.trim().length > 0,
  ) as { id: string; name: string; image_url: string }[];

  let migrated = 0;
  let skipped = 0;

  for (const row of rows) {
    const imageUrl = row.image_url.trim();

    if (!isSupabaseStorageUrl(imageUrl)) {
      if (imageUrl.startsWith(r2.publicBaseUrl)) {
        skipped += 1;
        continue;
      }
      console.log(`Skip ${row.name} — external URL`);
      skipped += 1;
      continue;
    }

    const storagePath = storagePathFromSupabaseUrl(imageUrl);
    if (!storagePath) {
      console.warn(`Skip ${row.name} — could not parse storage path`);
      skipped += 1;
      continue;
    }

    const { data: blob, error: downloadError } = await supabase.storage
      .from('product-images')
      .download(storagePath);

    if (downloadError || !blob) {
      console.warn(`Skip ${row.name} — download failed: ${downloadError?.message ?? 'no data'}`);
      skipped += 1;
      continue;
    }

    const buffer = Buffer.from(await blob.arrayBuffer());
    const key = storagePathForProduct(LIQUOR_CLIENT_ID, row.id);
    await putProductImage(LIQUOR_CLIENT_ID, row.id, buffer);

    const newUrl = publicUrlForPath(r2, key);
    const { error: updateError } = await supabase
      .from('products')
      .update({ image_url: newUrl })
      .eq('id', row.id);

    if (updateError) {
      throw new Error(`Update ${row.id}: ${updateError.message}`);
    }

    console.log(`Migrated: ${row.name}`);
    migrated += 1;
  }

  console.log(`\nDone. Migrated ${migrated}, skipped ${skipped}.`);
}

main().catch((err: unknown) => {
  console.error(err);
  process.exit(1);
});
