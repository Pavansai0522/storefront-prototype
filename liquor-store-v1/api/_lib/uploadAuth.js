const { createClient } = require('@supabase/supabase-js');
const { loadServerEnv } = require('./loadServerEnv');

function supabaseAuthClient(accessToken) {
  loadServerEnv();
  const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY ?? process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    throw new Error(
      'Supabase URL and anon key are required. Set SUPABASE_URL and SUPABASE_ANON_KEY on Vercel.',
    );
  }
  return createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  });
}

async function authorizeProductImageUpload(authorizationHeader, clientId) {
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
  // Must pass JWT explicitly — persistSession is false, so getUser() alone has no session.
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(token);

  if (userError || !user) {
    const detail = userError?.message ? ` ${userError.message}` : '';
    return {
      ok: false,
      status: 401,
      message: `Invalid or expired session.${detail} Try logging out and back in.`,
    };
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

  const role = profile.role;
  const profileClientId = profile.client_id;

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

module.exports = { authorizeProductImageUpload };
