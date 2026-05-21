import type { IncomingMessage, ServerResponse } from 'node:http';
import { authorizeProductImageUpload } from './uploadAuth';
import { putProductImage } from './r2Client';

const MAX_BYTES = 5 * 1024 * 1024;

type RequestWithBody = IncomingMessage & { body?: unknown };

function readBodyFromBuffer(body: unknown): Buffer | null {
  if (Buffer.isBuffer(body)) {
    return body;
  }
  if (typeof body === 'string') {
    return Buffer.from(body, 'binary');
  }
  if (body instanceof ArrayBuffer) {
    return Buffer.from(body);
  }
  if (body instanceof Uint8Array) {
    return Buffer.from(body);
  }
  return null;
}

function readBody(req: RequestWithBody): Promise<Buffer> {
  const buffered = readBodyFromBuffer(req.body);
  if (buffered) {
    if (buffered.length > MAX_BYTES) {
      return Promise.reject(new Error('Image is too large (max 5 MB).'));
    }
    return Promise.resolve(buffered);
  }

  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let total = 0;

    req.on('data', (chunk: Buffer) => {
      total += chunk.length;
      if (total > MAX_BYTES) {
        reject(new Error('Image is too large (max 5 MB).'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });

    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

function sendJson(res: ServerResponse, status: number, body: Record<string, string>): void {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

export async function handleUploadProductImage(
  req: RequestWithBody,
  res: ServerResponse,
): Promise<void> {
  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.setHeader('Access-Control-Allow-Methods', 'PUT, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type, X-Client-Id, X-Product-Id');
    res.end();
    return;
  }

  if (req.method !== 'PUT') {
    sendJson(res, 405, { error: 'Method not allowed' });
    return;
  }

  const clientId = String(req.headers['x-client-id'] ?? '').trim();
  const productId = String(req.headers['x-product-id'] ?? '').trim();

  if (!productId) {
    sendJson(res, 400, { error: 'X-Product-Id header is required.' });
    return;
  }

  try {
    const auth = await authorizeProductImageUpload(req.headers.authorization, clientId);
    if (!auth.ok) {
      sendJson(res, auth.status, { error: auth.message });
      return;
    }

    const body = await readBody(req);
    if (body.length === 0) {
      sendJson(res, 400, { error: 'Empty image body.' });
      return;
    }

    const url = await putProductImage(clientId, productId, body);
    sendJson(res, 200, { url });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Upload failed.';
    sendJson(res, 500, { error: message });
  }
}

export function createUploadMiddleware(): (
  req: IncomingMessage,
  res: ServerResponse,
  next: () => void,
) => void {
  return (req, res, next) => {
    if (!req.url?.startsWith('/api/upload-product-image')) {
      next();
      return;
    }

    void handleUploadProductImage(req, res);
  };
}
