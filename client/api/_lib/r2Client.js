const { loadServerEnv } = require('./loadServerEnv');

function loadR2Config() {
  loadServerEnv();
  const accountId = process.env.R2_ACCOUNT_ID?.trim();
  const accessKeyId = process.env.R2_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim();
  const bucketName = process.env.R2_BUCKET_NAME?.trim();
  const publicBaseUrl = process.env.R2_PUBLIC_BASE_URL?.trim().replace(/\/$/, '');

  if (!accountId || !accessKeyId || !secretAccessKey || !bucketName || !publicBaseUrl) {
    const missing = [];
    if (!accountId) missing.push('R2_ACCOUNT_ID');
    if (!accessKeyId) missing.push('R2_ACCESS_KEY_ID');
    if (!secretAccessKey) missing.push('R2_SECRET_ACCESS_KEY');
    if (!bucketName) missing.push('R2_BUCKET_NAME');
    if (!publicBaseUrl) missing.push('R2_PUBLIC_BASE_URL');
    throw new Error(`R2 is not configured on the server. Missing: ${missing.join(', ')}`);
  }

  return { accountId, accessKeyId, secretAccessKey, bucketName, publicBaseUrl };
}

function storagePathForProduct(clientId, productId) {
  return `${clientId}/${productId}.jpg`;
}

function publicUrlForPath(config, objectKey) {
  return `${config.publicBaseUrl}/${objectKey}`;
}

let cachedClient = null;

async function getR2S3Client(config) {
  if (!cachedClient) {
    const { S3Client } = await import('@aws-sdk/client-s3');
    cachedClient = new S3Client({
      region: 'auto',
      endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      requestChecksumCalculation: 'WHEN_REQUIRED',
      responseChecksumValidation: 'WHEN_REQUIRED',
    });
  }
  return cachedClient;
}

async function putProductImage(clientId, productId, body) {
  const config = loadR2Config();
  const key = storagePathForProduct(clientId, productId);
  const client = await getR2S3Client(config);

  try {
    const { PutObjectCommand } = await import('@aws-sdk/client-s3');
    await client.send(
      new PutObjectCommand({
        Bucket: config.bucketName,
        Key: key,
        Body: body,
        ContentType: 'image/jpeg',
        CacheControl: 'public, max-age=31536000, immutable',
      }),
    );
  } catch (err) {
    const detail = err instanceof Error ? err.message : 'Unknown R2 error';
    throw new Error(
      `R2 upload failed (${config.bucketName}/${key}): ${detail}. Check token permissions and matching Access Key + Secret pair.`,
    );
  }

  return publicUrlForPath(config, key);
}

module.exports = {
  putProductImage,
  loadR2Config,
  storagePathForProduct,
  publicUrlForPath,
};
