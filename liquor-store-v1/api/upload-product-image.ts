import type { IncomingMessage, ServerResponse } from 'node:http';
import { loadServerEnv } from './_lib/loadServerEnv';
import { handleUploadProductImage } from './_lib/uploadProductImageHttp';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse & {
    status?: (code: number) => { json: (body: unknown) => void };
    headersSent?: boolean;
  },
): Promise<void> {
  try {
    loadServerEnv();
    await handleUploadProductImage(req, res);
  } catch (err) {
    const response = res as ServerResponse & {
      headersSent?: boolean;
      status?: (code: number) => { json: (body: unknown) => void };
    };
    if (!response.headersSent && typeof response.status === 'function') {
      const message = err instanceof Error ? err.message : 'Function failed to start.';
      response.status(500).json({ error: message });
    }
  }
}
