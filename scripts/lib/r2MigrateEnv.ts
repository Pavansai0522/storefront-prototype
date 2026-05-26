export type R2Config = {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  publicBaseUrl: string;
};

export function loadR2Config(): R2Config {
  const accountId = process.env.R2_ACCOUNT_ID?.trim();
  const accessKeyId = process.env.R2_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim();
  const bucketName = process.env.R2_BUCKET_NAME?.trim();
  const publicBaseUrl = process.env.R2_PUBLIC_BASE_URL?.trim().replace(/\/$/, '');

  if (!accountId || !accessKeyId || !secretAccessKey || !bucketName || !publicBaseUrl) {
    const missing: string[] = [];
    if (!accountId) missing.push('R2_ACCOUNT_ID');
    if (!accessKeyId) missing.push('R2_ACCESS_KEY_ID');
    if (!secretAccessKey) missing.push('R2_SECRET_ACCESS_KEY');
    if (!bucketName) missing.push('R2_BUCKET_NAME');
    if (!publicBaseUrl) missing.push('R2_PUBLIC_BASE_URL');
    throw new Error(`R2 is not configured. Missing: ${missing.join(', ')}`);
  }

  return { accountId, accessKeyId, secretAccessKey, bucketName, publicBaseUrl };
}

export function storagePathForProduct(clientId: string, productId: string): string {
  return `${clientId}/${productId}.jpg`;
}

export function publicUrlForPath(config: R2Config, objectKey: string): string {
  return `${config.publicBaseUrl}/${objectKey}`;
}
