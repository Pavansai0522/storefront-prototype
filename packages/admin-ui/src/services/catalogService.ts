import { dbProductToProduct, productToDbInsert, productToDbUpdate } from '../lib/dbMappers';
import { isLocalDevMode } from '../lib/devMode';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { MOCK_ACCESSORIES, MOCK_PRODUCTS } from '../mock/products';
import type { DbProduct } from '../lib/supabaseTypes';
import type { Product } from '../types';

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
  return (data as DbProduct[]).map(dbProductToProduct);
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
  return (data as DbProduct[]).map(dbProductToProduct);
}

export async function createProduct(product: Omit<Product, 'id'>): Promise<Product> {
  const row = productToDbInsert(product);
  const { data, error } = await supabase
    .from('products')
    .insert(row)
    .select('*')
    .single();
  if (error) {
    throw new Error(error.message);
  }
  return dbProductToProduct(data as DbProduct);
}

export async function updateProduct(id: string, patch: Partial<Product>): Promise<Product> {
  const row = productToDbUpdate(patch);
  const { data, error } = await supabase
    .from('products')
    .update(row)
    .eq('id', id)
    .select('*')
    .single();
  if (error) {
    throw new Error(error.message);
  }
  return dbProductToProduct(data as DbProduct);
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
