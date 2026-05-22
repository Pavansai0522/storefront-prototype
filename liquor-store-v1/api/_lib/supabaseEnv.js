/**
 * Resolve Supabase URL + anon key for API routes.
 * Prefer VITE_* so the server matches the browser build (JWT issuer).
 * Wrong SUPABASE_* on Vercel causes "Invalid API key" on upload auth.
 */
function trimEnv(name) {
  return process.env[name]?.trim() || '';
}

function keySuffix(key) {
  if (!key || key.length < 8) return null;
  return key.slice(-8);
}

function resolveSupabaseEnv() {
  const viteUrl = trimEnv('VITE_SUPABASE_URL');
  const viteKey = trimEnv('VITE_SUPABASE_ANON_KEY');
  const serverUrl = trimEnv('SUPABASE_URL');
  const serverKey = trimEnv('SUPABASE_ANON_KEY');

  const urlMismatch = Boolean(viteUrl && serverUrl && viteUrl !== serverUrl);
  const keyMismatch = Boolean(viteKey && serverKey && viteKey !== serverKey);

  // Match admin client: VITE_* first (same as catalogService / AdminApp build).
  const url = viteUrl || serverUrl;
  const anonKey = viteKey || serverKey;

  let host = null;
  if (url) {
    try {
      host = new URL(url).hostname;
    } catch {
      host = 'invalid-url';
    }
  }

  return {
    url,
    anonKey,
    host,
    urlMismatch,
    keyMismatch,
    mismatch: urlMismatch || keyMismatch,
    source: viteUrl && viteKey ? 'VITE_*' : serverUrl && serverKey ? 'SUPABASE_*' : 'missing',
    viteKeySuffix: keySuffix(viteKey),
    serverKeySuffix: keySuffix(serverKey),
    activeKeySuffix: keySuffix(anonKey),
  };
}

module.exports = { resolveSupabaseEnv };
