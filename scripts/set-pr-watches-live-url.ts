/**
 * Set PR Watches `clients.live_url` after Vercel deploy (before custom domain).
 * Usage: npm run set:pr-watches-url -- https://your-project.vercel.app
 */
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const liveUrl = process.argv[2]?.trim();
if (!liveUrl) {
  console.error('Usage: npm run set:pr-watches-url -- <https://your-vercel-url>');
  process.exit(1);
}

const url = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const serviceKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SECRET_KEY;

if (!url || !serviceKey) {
  console.error('Missing SUPABASE_URL and SUPABASE_SECRET_KEY in root .env');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { error } = await supabase
  .from('clients')
  .update({ live_url: liveUrl.replace(/\/$/, '') })
  .eq('id', 'client-watches-1');

if (error) {
  console.error(error.message);
  process.exit(1);
}

console.log(`Updated PR Watches live_url → ${liveUrl}`);
