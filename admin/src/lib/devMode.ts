import { isSupabaseConfigured } from './supabase';

/** True when admin runs without Supabase env (in-memory demo data + mock sign-in). */
export const isLocalDevMode = !isSupabaseConfigured;
