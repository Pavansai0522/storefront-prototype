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

export async function uploadProductImage(
  clientId: string,
  productId: string,
  file: File,
): Promise<string> {
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
