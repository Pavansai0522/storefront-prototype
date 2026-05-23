import { createClient, type SupabaseClient, type SupabaseClientOptions } from '@supabase/supabase-js';
import WebSocket from 'ws';

/** Supabase client for Node.js < 22 (tsx scripts, migrations). */
export function createNodeSupabase(
  url: string,
  key: string,
  options: SupabaseClientOptions = {},
): SupabaseClient {
  const { realtime: realtimeOptions, ...rest } = options;
  return createClient(url, key, {
    ...rest,
    realtime: {
      ...realtimeOptions,
      transport: WebSocket,
    },
  });
}
