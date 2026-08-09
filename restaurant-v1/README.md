# Aruna's Eagle storefront (`restaurant-v1`)

Vite + React restaurant site with embedded `/admin`. Menu items load from Supabase when configured; otherwise the local sample menu is shown.

## Local dev

1. Copy `.env.example` → `.env` (Supabase + client slug/id).
2. Seed the client (once): from repo root, `npm run seed:restaurant`
3. `npm run dev:restaurant` → http://localhost:3003

## Admin

- Store admin: `/admin` on the storefront (credentials from seed script output)
- Superadmin: same `/admin` path with `VITE_SUPERADMIN_EMAIL`

## Seed

```bash
npm run seed:restaurant
# Replace existing menu:
SEED_FORCE=true npm run seed:restaurant
```

Optional env overrides: `RESTAURANT_STORE_ADMIN_EMAIL`, `RESTAURANT_STORE_ADMIN_PASSWORD`, `RESTAURANT_LIVE_URL`.

## Vercel deploy

| Setting | Value |
|---------|--------|
| Project | `storefront-prototype-restaurant-v1` |
| Project ID | `prj_sLqd1OS5yFO7Je3s4HdBLfLaMbGJ` |
| Production URL | https://storefront-prototype-restaurant-v1.vercel.app |
| Root directory | `restaurant-v1` |
| GitHub repo | `Pavansai0522/storefront-prototype` |

GitHub Actions secret (repo → Settings → Secrets → Actions):

- `VERCEL_RESTAURANT_PROJECT_ID` = `prj_sLqd1OS5yFO7Je3s4HdBLfLaMbGJ`

Or via CLI after `gh auth login`:

```bash
gh secret set VERCEL_RESTAURANT_PROJECT_ID --body "prj_sLqd1OS5yFO7Je3s4HdBLfLaMbGJ"
```

Deploy manually: GitHub → **Actions** → **Deploy Restaurant Storefront** → **Run workflow**.
