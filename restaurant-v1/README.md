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
