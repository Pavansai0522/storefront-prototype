import type { IncomingMessage, ServerResponse } from 'node:http';
import { sendJson } from './_lib/sendJson';

function envPresent(name: string): boolean {
  return Boolean(process.env[name]?.trim());
}

export default function handler(_req: IncomingMessage, res: ServerResponse): void {
  try {
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

    sendJson(res, 200, {
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
  } catch (err) {
    sendJson(res, 500, {
      error: err instanceof Error ? err.message : 'upload-status failed',
    });
  }
}
