import type { IncomingMessage, ServerResponse } from 'node:http';
import { sendJson } from './_lib/sendJson';

/** Minimal route to verify Vercel API runtime (no extra imports). */
export default function handler(_req: IncomingMessage, res: ServerResponse): void {
  sendJson(res, 200, { ok: true, route: 'health' });
}
