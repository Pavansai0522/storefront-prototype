const { sendJson } = require('./_lib/sendJson');
const { resolveSupabaseEnv } = require('./_lib/supabaseEnv');

function envPresent(name) {
  return Boolean(process.env[name]?.trim());
}

module.exports = function handler(_req, res) {
  try {
    const supabase = resolveSupabaseEnv();

    const r2Keys = [
      'R2_ACCOUNT_ID',
      'R2_ACCESS_KEY_ID',
      'R2_SECRET_ACCESS_KEY',
      'R2_BUCKET_NAME',
      'R2_PUBLIC_BASE_URL',
    ];

    const missingR2 = r2Keys.filter((key) => !envPresent(key));

    sendJson(res, 200, {
      ok:
        missingR2.length === 0 &&
        Boolean(supabase.url && supabase.anonKey) &&
        !supabase.mismatch,
      vercelEnv: process.env.VERCEL_ENV ?? null,
      supabase: {
        configured: Boolean(supabase.url && supabase.anonKey),
        source: supabase.source,
        host: supabase.host,
        activeKeySuffix: supabase.activeKeySuffix,
        viteKeySuffix: supabase.viteKeySuffix,
        serverKeySuffix: supabase.serverKeySuffix,
        mismatch: supabase.mismatch,
        urlMismatch: supabase.urlMismatch,
        keyMismatch: supabase.keyMismatch,
      },
      r2: {
        configured: missingR2.length === 0,
        missing: missingR2,
        bucket: process.env.R2_BUCKET_NAME?.trim() ?? null,
        publicBaseUrl: process.env.R2_PUBLIC_BASE_URL?.trim() ?? null,
      },
      uploadPath: '/api/upload-product-image',
      hint: supabase.mismatch
        ? 'Fix: delete SUPABASE_URL and SUPABASE_ANON_KEY on Vercel OR set them equal to VITE_SUPABASE_* (use anon key, not service_role).'
        : missingR2.length > 0
          ? 'Add missing R2_* in Vercel → Environment Variables → Production, then redeploy.'
          : 'Compare activeKeySuffix with your Supabase anon key (last 8 chars). If upload fails with Invalid API key, fix VITE_SUPABASE_ANON_KEY on Vercel.',
    });
  } catch (err) {
    sendJson(res, 500, {
      error: err instanceof Error ? err.message : 'upload-status failed',
    });
  }
};
