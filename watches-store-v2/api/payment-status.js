const { loadServerEnv } = require('./_lib/loadServerEnv');
const { sendJson } = require('./_lib/sendJson');
const { getRazorpayKeys, paymentsConfigured } = require('./_lib/razorpayConfig');

function envPresent(name) {
  return Boolean(process.env[name]?.trim());
}

function resolveSupabaseAdminEnv() {
  const hasUrl = envPresent('SUPABASE_URL') || envPresent('VITE_SUPABASE_URL');
  const hasServiceKey =
    envPresent('SUPABASE_SERVICE_ROLE_KEY') || envPresent('SUPABASE_SECRET_KEY');
  const missing = [];
  if (!hasUrl) {
    missing.push('SUPABASE_URL or VITE_SUPABASE_URL');
  }
  if (!hasServiceKey) {
    missing.push('SUPABASE_SERVICE_ROLE_KEY or SUPABASE_SECRET_KEY');
  }
  return {
    configured: hasUrl && hasServiceKey,
    hasUrl,
    hasServiceKey,
    missing,
  };
}

module.exports = function handler(_req, res) {
  try {
    loadServerEnv();
    const razorpayConfigured = paymentsConfigured();
    const { keyId } = getRazorpayKeys();
    const supabase = resolveSupabaseAdminEnv();
    const configured = razorpayConfigured && supabase.configured;

    let hint = null;
    if (!supabase.hasServiceKey) {
      hint =
        'Checkout needs the Supabase service role key on Vercel (SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY). VITE_SUPABASE_ANON_KEY is for the browser only.';
    } else if (!razorpayConfigured) {
      hint = 'Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET on Vercel (Production).';
    }

    sendJson(res, 200, {
      configured,
      keyId: razorpayConfigured ? keyId : null,
      razorpay: { configured: razorpayConfigured },
      supabase,
      hint,
    });
  } catch (err) {
    sendJson(res, 500, {
      error: err instanceof Error ? err.message : 'payment-status failed',
    });
  }
};
