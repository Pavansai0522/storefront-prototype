import { createClient } from '@supabase/supabase-js';
import { loadServerEnv } from './loadServerEnv';

export type UploadAuthResult =
  | { ok: true; userId: string }
  | { ok: false; status: number; message: string };

function supabaseAuthClient(accessToken: string) {
  loadServerEnv();
  const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      'Supabase URL and anon key are required for upload auth. Set SUPABASE_URL and SUPABASE_ANON_KEY (or VITE_SUPABASE_*) on Vercel and in liquor-store-v1/.env.',
    );
  }
  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });
}

export async function authorizeProductImageUpload(
  authorizationHeader: string | undefined,
  clientId: string,
): Promise<UploadAuthResult> {
  if (!authorizationHeader?.startsWith('Bearer ')) {
    return { ok: false, status: 401, message: 'Missing authorization token.' };
  }

  const token = authorizationHeader.slice('Bearer '.length).trim();
  if (!token) {
    return { ok: false, status: 401, message: 'Missing authorization token.' };
  }

  if (!clientId.trim()) {
    return { ok: false, status: 400, message: 'clientId is required.' };
  }

  const supabase = supabaseAuthClient(token);
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { ok: false, status: 401, message: 'Invalid or expired session.' };
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role, client_id')
    .eq('id', user.id)
    .maybeSingle();

  if (profileError || !profile) {
    const detail = profileError?.message ? ` (${profileError.message})` : '';
    return { ok: false, status: 403, message: `Profile not found${detail}.` };
  }

  const role = profile.role as string;
  const profileClientId = profile.client_id as string | null;

  if (role === 'superadmin') {
    return { ok: true, userId: user.id };
  }

  if (role === 'admin' && profileClientId === clientId) {
    return { ok: true, userId: user.id };
  }

  return {
    ok: false,
    status: 403,
    message: `Not authorized for store ${clientId}. Profile is tied to ${profileClientId ?? 'no store'}.`,
  };
}
