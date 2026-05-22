import type { VercelRequest, VercelResponse } from '@vercel/node';
import { loadServerEnv } from './_lib/loadServerEnv';

function envPresent(name: string): boolean {
  const value = process.env[name]?.trim();
  return Boolean(value);
}

export default function handler(_req: VercelRequest, res: VercelResponse): void {
  loadServerEnv();

  const supabaseUrl = envPresent('SUPABASE_URL') || envPresent('VITE_SUPABASE_URL');
  const supabaseAnon =
    envPresent('SUPABASE_ANON_KEY') || envPresent('VITE_SUPABASE_ANON_KEY');

  const r2Keys = [
    'R2_ACCOUNT_ID',
    'R2_ACCESS_KEY_ID',
    'R2_SECRET_ACCESS_KEY',
    'R2_BUCKET_NAME',
    'R2_PUBLIC_BASE_URL',
  ] as const;

  const missingR2 = r2Keys.filter((key) => !envPresent(key));

  res.status(200).json({
    ok: missingR2.length === 0 && supabaseUrl && supabaseAnon,
    vercelEnv: process.env.VERCEL_ENV ?? null,
    supabase: { url: supabaseUrl, anonKey: supabaseAnon },
    r2: {
      configured: missingR2.length === 0,
      missing: missingR2,
      bucket: process.env.R2_BUCKET_NAME?.trim() ?? null,
      publicBaseUrl: process.env.R2_PUBLIC_BASE_URL?.trim() ?? null,
    },
    uploadPath: '/api/upload-product-image',
    hint:
      missingR2.length > 0
        ? 'Add missing R2_* variables in Vercel → Settings → Environment Variables, then redeploy.'
        : 'Env looks complete. If upload still fails, check PUT response body for the error field.',
  });
}
