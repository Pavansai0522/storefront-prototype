# Mobile Store storefront (`client`)

Vite + React catalog with embedded `/admin`. Product images use **Cloudflare R2** when `VITE_PRODUCT_IMAGE_UPLOAD_URL` is set.

## Local dev

1. Copy `.env.example` → `.env` (Supabase + `VITE_PRODUCT_IMAGE_UPLOAD_URL`).
2. Add R2 credentials to `supabase/.env` or root `.env` (see below).
3. From repo root: `npm run dev:client` → http://localhost:5173

Uploads hit `/api/upload-product-image` via the Vite dev middleware.

## Cloudflare R2 setup

1. **Cloudflare dashboard** → R2 → Create bucket (e.g. `bala-mobiles-products`).
2. **Manage R2 API tokens** → Create token with Object Read & Write on that bucket.
3. Enable **public access** for the bucket (R2.dev subdomain or custom domain) and note the public base URL.
4. Add to **Vercel** (Mobile Store project → Settings → Environment Variables):

| Variable | Example |
|----------|---------|
| `R2_ACCOUNT_ID` | Cloudflare account ID |
| `R2_ACCESS_KEY_ID` | From API token |
| `R2_SECRET_ACCESS_KEY` | From API token |
| `R2_BUCKET_NAME` | `bala-mobiles-products` |
| `R2_PUBLIC_BASE_URL` | `https://pub-xxxx.r2.dev` (no trailing slash) |
| `SUPABASE_URL` | **Required on Vercel** — same value as `VITE_SUPABASE_URL` |
| `SUPABASE_ANON_KEY` | **Required on Vercel** — same value as `VITE_SUPABASE_ANON_KEY` |
| `VITE_PRODUCT_IMAGE_UPLOAD_URL` | `/api/upload-product-image` |

5. Redeploy the Mobile Store project.

If upload returns **500**, open the failed request in DevTools → **Response** and read the `error` field. Common fixes:

- Missing `R2_*` or `SUPABASE_URL` / `SUPABASE_ANON_KEY` on Vercel (server env, not only `VITE_*`)
- `VITE_PRODUCT_IMAGE_UPLOAD_URL` must be `/api/upload-product-image`
- `R2_PUBLIC_BASE_URL` must be the **pub-….r2.dev** URL, not `….cloudflarestorage.com`

Check config: `GET /api/upload-status` on your deployed URL.

## Migrate existing Supabase Storage images

After R2 is configured:

```bash
npm run migrate:bala-images
```

Uses `VITE_CLIENT_ID` from env (default `client-bala-1`). Copies each `product-images` object to R2 and updates `products.image_url`.
