# Watches Store V2 — PR Watches & Gadgets

Production storefront for **PR Watches** (`client-watches-1` / slug `pr-watches-gadgets`). Product images use **Cloudflare R2** when `VITE_PRODUCT_IMAGE_UPLOAD_URL` is set.

## Local dev

From repo root:

```bash
npm run dev:watches
```

Open http://localhost:3002

1. Copy `.env.example` → `.env` (Supabase + `VITE_PRODUCT_IMAGE_UPLOAD_URL`).
2. Add R2 credentials to `supabase/.env` or root `.env` (see below).

Uploads hit `/api/upload-product-image` via the Vite dev middleware.

## Cloudflare R2 setup

1. **Cloudflare dashboard** → R2 → Create bucket (e.g. `pr-watches-products`).
2. **Manage R2 API tokens** → Create token with Object Read & Write on that bucket.
3. Enable **public access** for the bucket (R2.dev subdomain or custom domain) and note the public base URL.
4. Add to **Vercel** (watches project → Settings → Environment Variables):

| Variable | Example |
|----------|---------|
| `R2_ACCOUNT_ID` | Cloudflare account ID |
| `R2_ACCESS_KEY_ID` | From API token |
| `R2_SECRET_ACCESS_KEY` | From API token |
| `R2_BUCKET_NAME` | `pr-watches-products` |
| `R2_PUBLIC_BASE_URL` | `https://pub-xxxx.r2.dev` (no trailing slash) |
| `SUPABASE_URL` | **Required on Vercel** — same value as `VITE_SUPABASE_URL` |
| `SUPABASE_ANON_KEY` | **Required on Vercel** — same value as `VITE_SUPABASE_ANON_KEY` |
| `VITE_PRODUCT_IMAGE_UPLOAD_URL` | `/api/upload-product-image` |

5. Redeploy the watches project.

If upload returns **500**, open the failed request in DevTools → **Response** and read the `error` field. Common fixes:

- Missing `R2_*` or `SUPABASE_URL` / `SUPABASE_ANON_KEY` on Vercel (server env, not only `VITE_*`)
- `VITE_PRODUCT_IMAGE_UPLOAD_URL` must be `/api/upload-product-image`
- `R2_PUBLIC_BASE_URL` must be the **pub-….r2.dev** URL, not `….cloudflarestorage.com`

Check config: `GET /api/upload-status` on your deployed URL.

## Migrate existing Supabase Storage images

After R2 is configured:

```bash
npm run migrate:watches-images
```

Uses `VITE_CLIENT_ID` from env (default `client-watches-1`). Copies each `product-images` object to R2 and updates `products.image_url`.

## Weekend launch (Vercel, domain later)

### 1. GitHub secrets (repo → Settings → Secrets → Actions)

| Secret | Value |
|--------|--------|
| `VERCEL_TOKEN` | Vercel → Settings → Tokens |
| `VERCEL_ORG_ID` | Vercel team/org id |
| `VERCEL_WATCHES_PROJECT_ID` | Vercel project for this app |
| `VITE_SUPABASE_URL` | `https://uivefhsunibyqguwemtl.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Supabase publishable key (`sb_publishable_…`) |

### 2. Vercel project env (same values)

In the watches Vercel project → Settings → Environment Variables (Production):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_CLIENT_SLUG` = `pr-watches-gadgets`
- `VITE_CLIENT_ID` = `client-watches-1`
- `VITE_SUPERADMIN_EMAIL` = your superadmin email(s), comma-separated

Store owners and superadmins use **embedded admin** at `/admin` on the same domain (e.g. `https://pr-watches.com/admin`).

### 3. Deploy

GitHub → **Actions** → **Deploy Watches Storefront** → **Run workflow**

Or locally: `npm run build -w watches-store-v2` then `vercel --prod` from `watches-store-v2/`.

### 4. Point admin “Preview store” to Vercel URL

After deploy, copy the `*.vercel.app` URL and from repo root:

```bash
npm run set:pr-watches-url -- https://your-app.vercel.app
```

### 5. Custom domain (when you buy it)

1. Vercel → Project → Domains → add `www.yourdomain.com`
2. Update DNS at your registrar per Vercel instructions
3. Re-run `npm run set:pr-watches-url -- https://www.yourdomain.com`

## Admin operations

| Task | How |
|------|-----|
| Store owner / superadmin login | `https://your-domain.com/admin` |
| Superadmin catalog edits | Sign in → Clients → **Manage as store** → Products |
| Store owner login | Supabase account linked to `client-watches-1` |
| Take site offline | Admin → impersonate store → Client detail → deactivate site |

## Scripts

- `npm run build:watches` — production build
- `npm run lint:watches` — ESLint
