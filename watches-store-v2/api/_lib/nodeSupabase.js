const { createClient } = require('@supabase/supabase-js');
const WebSocket = require('ws');

/** Supabase client for Node.js < 22 (Vercel API routes, Vite dev middleware). */
function createNodeSupabaseClient(url, anonKey, options = {}) {
  const { realtime: realtimeOptions, ...rest } = options;
  return createClient(url, anonKey, {
    ...rest,
    realtime: {
      ...realtimeOptions,
      transport: WebSocket,
    },
  });
}

module.exports = { createNodeSupabaseClient };
