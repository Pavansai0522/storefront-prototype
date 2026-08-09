import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(url && anonKey);

function createSupabaseClient(): SupabaseClient {
  if (!url || !anonKey) {
    throw new Error('Supabase env vars are not configured.');
  }
  return createClient(url, anonKey);
}

export const supabase: SupabaseClient = isSupabaseConfigured
  ? createSupabaseClient()
  : (createClient('https://placeholder.supabase.co', 'placeholder') as SupabaseClient);
