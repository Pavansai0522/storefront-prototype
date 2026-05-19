# Watches Store V2 — PR Watches & Gadgets

Production storefront for **PR Watches** (`client-watches-1` / slug `pr-watches-gadgets`).

## Local dev

From repo root:

```bash
npm run dev:watches
```

Open http://localhost:3002

Copy `.env.example` → `.env` and set Supabase publishable keys (same project as admin).

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
