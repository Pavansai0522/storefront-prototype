const { createNodeSupabaseClient } = require('./nodeSupabase');

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;

  if (!url || !serviceKey) {
    const missing = [];
    if (!url) {
      missing.push('SUPABASE_URL or VITE_SUPABASE_URL');
    }
    if (!serviceKey) {
      missing.push('SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SECRET_KEY (service role — not the anon key)');
    }
    throw new Error(`Missing Supabase server config: ${missing.join(', ')}`);
  }

  return createNodeSupabaseClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

module.exports = { getSupabaseAdmin };
