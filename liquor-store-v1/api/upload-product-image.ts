import type { VercelRequest, VercelResponse } from '@vercel/node';
import { loadServerEnv } from './_lib/loadServerEnv';
import { handleUploadProductImage } from './_lib/uploadProductImageHttp';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  try {
    loadServerEnv();
    await handleUploadProductImage(req, res);
  } catch (err) {
    if (!res.headersSent) {
      const message = err instanceof Error ? err.message : 'Function failed to start.';
      res.status(500).json({ error: message });
    }
  }
}
