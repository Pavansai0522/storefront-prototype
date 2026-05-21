import type { VercelRequest, VercelResponse } from '@vercel/node';
import { loadServerEnv } from '../server/loadServerEnv';
import { handleUploadProductImage } from '../server/uploadProductImageHttp';

loadServerEnv();

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: VercelRequest, res: VercelResponse): Promise<void> {
  await handleUploadProductImage(req, res);
}
