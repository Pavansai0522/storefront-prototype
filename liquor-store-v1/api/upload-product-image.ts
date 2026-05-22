import type { IncomingMessage, ServerResponse } from 'node:http';
import { loadServerEnv } from './_lib/loadServerEnv';
import { sendJson } from './_lib/sendJson';
import { handleUploadProductImage } from './_lib/uploadProductImageHttp';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<void> {
  try {
    loadServerEnv();
    await handleUploadProductImage(req, res);
  } catch (err) {
    if (!res.headersSent) {
      const message = err instanceof Error ? err.message : 'Function failed to start.';
      sendJson(res, 500, { error: message });
    }
  }
}
