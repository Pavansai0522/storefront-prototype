import { currencyForCountry, type CurrencyCode } from '../constants/countryCurrency';
import { dbProductToProduct, productToDbInsert, productToDbUpdate } from '../lib/dbMappers';
import { isLocalDevMode } from '../lib/devMode';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { MOCK_ACCESSORIES, MOCK_PRODUCTS } from '../mock/products';
import type { DbProduct } from '../lib/supabaseTypes';
import type { Product } from '../types';

async function currencyForClientId(clientId: string): Promise<CurrencyCode> {
  if (!isSupabaseConfigured) {
    return 'INR';
  }
  const { data, error } = await supabase
    .from('clients')
    .select('country, template')
    .eq('id', clientId)
    .maybeSingle();
  if (error || !data) {
    return 'INR';
  }
  const row = data as { country: string | null; template: string | null };
  return currencyForCountry(
    row.country as Parameters<typeof currencyForCountry>[0],
    row.template,
  );
}

async function loadClientCurrencyMap(): Promise<Map<string, CurrencyCode>> {
  const map = new Map<string, CurrencyCode>();
  if (!isSupabaseConfigured) {
    return map;
  }
  const { data, error } = await supabase.from('clients').select('id, country, template');
  if (error || !data) {
    return map;
  }
  for (const row of data as { id: string; country: string | null; template: string | null }[]) {
    map.set(
      row.id,
      currencyForCountry(
        row.country as Parameters<typeof currencyForCountry>[0],
        row.template,
      ),
    );
  }
  return map;
}

export async function fetchAllProducts(): Promise<Product[]> {
  if (isLocalDevMode) {
    return [...MOCK_PRODUCTS, ...MOCK_ACCESSORIES];
  }
  if (!isSupabaseConfigured) {
    return [];
  }
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) {
    throw new Error(error.message);
  }
  const currencyMap = await loadClientCurrencyMap();
  return (data as DbProduct[]).map((row) =>
    dbProductToProduct(row, currencyMap.get(row.client_id) ?? 'INR'),
  );
}

export async function fetchProductsByClient(clientId: string): Promise<Product[]> {
  if (isLocalDevMode) {
    return [...MOCK_PRODUCTS, ...MOCK_ACCESSORIES].filter((p) => p.clientId === clientId);
  }
  if (!isSupabaseConfigured) {
    return [];
  }
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('client_id', clientId)
    .order('sort_order', { ascending: true });
  if (error) {
    throw new Error(error.message);
  }
  const currency = await currencyForClientId(clientId);
  return (data as DbProduct[]).map((row) => dbProductToProduct(row, currency));
}

export async function createProduct(product: Product): Promise<Product> {
  const currency = await currencyForClientId(product.clientId);
  const row = productToDbInsert(product, currency);
  const { data, error } = await supabase
    .from('products')
    .insert(row)
    .select('*')
    .single();
  if (error) {
    throw new Error(error.message);
  }
  return dbProductToProduct(data as DbProduct, currency);
}

export async function updateProduct(id: string, patch: Partial<Product>): Promise<Product> {
  const { data: existing, error: lookupError } = await supabase
    .from('products')
    .select('client_id')
    .eq('id', id)
    .maybeSingle();
  if (lookupError) {
    throw new Error(lookupError.message);
  }
  const ownerId =
    patch.clientId ?? (existing as { client_id: string } | null)?.client_id ?? null;
  const currency = ownerId ? await currencyForClientId(ownerId) : 'INR';
  const row = productToDbUpdate(patch, currency);
  const { data, error } = await supabase
    .from('products')
    .update(row)
    .eq('id', id)
    .select('*')
    .single();
  if (error) {
    throw new Error(error.message);
  }
  return dbProductToProduct(data as DbProduct, currency);
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteProducts(ids: string[]): Promise<void> {
  const { error } = await supabase.from('products').delete().in('id', ids);
  if (error) {
    throw new Error(error.message);
  }
}

async function getUploadAccessToken(): Promise<string> {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    throw new Error(error.message);
  }
  const token = data.session?.access_token;
  if (!token) {
    throw new Error('You must be logged in to upload images.');
  }
  return token;
}

function resolveProductImageUploadUrl(): string | null {
  const configured = import.meta.env.VITE_PRODUCT_IMAGE_UPLOAD_URL as string | undefined;
  if (!configured?.trim()) {
    return null;
  }
  const trimmed = configured.trim();
  if (trimmed.includes('r2.cloudflarestorage.com')) {
    throw new Error(
      'VITE_PRODUCT_IMAGE_UPLOAD_URL must be /api/upload-product-image, not the R2 S3 endpoint. Set R2_PUBLIC_BASE_URL for the public image URL.',
    );
  }
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  const origin = import.meta.env.VITE_STOREFRONT_ORIGIN as string | undefined;
  const base = origin?.trim().replace(/\/$/, '') ?? '';
  return `${base}${trimmed.startsWith('/') ? trimmed : `/${trimmed}`}`;
}

async function uploadProductImageViaR2Api(
  clientId: string,
  productId: string,
  file: File,
): Promise<string> {
  const uploadUrl = resolveProductImageUploadUrl();
  if (!uploadUrl) {
    throw new Error('VITE_PRODUCT_IMAGE_UPLOAD_URL is not configured.');
  }

  const { compressImageFile } = await import('../lib/imageUpload');
  const blob = await compressImageFile(file);
  const token = await getUploadAccessToken();

  const response = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'image/jpeg',
      'X-Client-Id': clientId,
      'X-Product-Id': productId,
    },
    body: blob,
  });

  const payload = (await response.json().catch(() => null)) as { url?: string; error?: string } | null;
  if (!response.ok) {
    throw new Error(payload?.error ?? `Image upload failed (${response.status}).`);
  }
  if (!payload?.url) {
    throw new Error('Upload succeeded but no image URL was returned.');
  }
  return payload.url;
}

export async function uploadProductImage(
  clientId: string,
  productId: string,
  file: File,
): Promise<string> {
  if (resolveProductImageUploadUrl()) {
    return uploadProductImageViaR2Api(clientId, productId, file);
  }

  const { compressImageFile, storagePathForProduct } = await import('../lib/imageUpload');
  const blob = await compressImageFile(file);
  const path = storagePathForProduct(clientId, productId);
  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(path, blob, { upsert: true, contentType: 'image/jpeg' });
  if (uploadError) {
    throw new Error(uploadError.message);
  }
  const { data } = supabase.storage.from('product-images').getPublicUrl(path);
  return data.publicUrl;
}
