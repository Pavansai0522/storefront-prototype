import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { loadServerEnv } from './loadServerEnv';

export type R2Config = {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  publicBaseUrl: string;
};

export function loadR2Config(): R2Config {
  loadServerEnv();
  const accountId = process.env.R2_ACCOUNT_ID?.trim();
  const accessKeyId = process.env.R2_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim();
  const bucketName = process.env.R2_BUCKET_NAME?.trim();
  const publicBaseUrl = process.env.R2_PUBLIC_BASE_URL?.trim().replace(/\/$/, '');

  if (!accountId || !accessKeyId || !secretAccessKey || !bucketName || !publicBaseUrl) {
    throw new Error(
      'R2 is not configured. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME, and R2_PUBLIC_BASE_URL.',
    );
  }

  return { accountId, accessKeyId, secretAccessKey, bucketName, publicBaseUrl };
}

export function storagePathForProduct(clientId: string, productId: string): string {
  return `${clientId}/${productId}.jpg`;
}

export function publicUrlForPath(config: R2Config, objectKey: string): string {
  return `${config.publicBaseUrl}/${objectKey}`;
}

let cachedClient: S3Client | null = null;

function getR2S3Client(config: R2Config): S3Client {
  if (!cachedClient) {
    cachedClient = new S3Client({
      region: 'auto',
      endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
    });
  }
  return cachedClient;
}

export async function putProductImage(
  clientId: string,
  productId: string,
  body: Buffer,
): Promise<string> {
  const config = loadR2Config();
  const key = storagePathForProduct(clientId, productId);
  const client = getR2S3Client(config);

  await client.send(
    new PutObjectCommand({
      Bucket: config.bucketName,
      Key: key,
      Body: body,
      ContentType: 'image/jpeg',
      CacheControl: 'public, max-age=31536000, immutable',
    }),
  );

  return publicUrlForPath(config, key);
}
