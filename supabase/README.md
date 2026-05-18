# Supabase setup (PR Watches + agency admin)

## 1. Create project

Create a project at [supabase.com](https://supabase.com) and note:

- Project URL → `VITE_SUPABASE_URL` / `SUPABASE_URL`
- Anon key → `VITE_SUPABASE_ANON_KEY` (admin + watches `.env`)
- Service role key → `SUPABASE_SERVICE_ROLE_KEY` (seed script only; never in frontend)

## 2. Apply schema

Run the SQL in [`migrations/20260516100000_initial_schema.sql`](migrations/20260516100000_initial_schema.sql) via Supabase SQL Editor or CLI:

```bash
supabase db push
```

## 3. Create auth users

In Supabase Dashboard → Authentication → Users, create:

| Email | Role | `profiles` row |
|-------|------|----------------|
| `super@agency.com` | superadmin | `role=superadmin`, `client_id=null` |
| `owner@prwatches.example` | store admin | `role=admin`, `client_id=client-watches-1` |

After signup, update `public.profiles` (trigger creates a default row):

```sql
update public.profiles set role = 'superadmin', client_id = null where email = 'super@agency.com';
update public.profiles set role = 'admin', client_id = 'client-watches-1' where email = 'owner@prwatches.example';
```

## 4. Seed data

From repo root (with service role env vars):

```bash
npm install -D tsx
SUPABASE_URL=https://xxx.supabase.co SUPABASE_SERVICE_ROLE_KEY=eyJ... npx tsx scripts/seed-watches-catalog.ts
```

## 5. Local env

**admin/.env**

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

**watches-store-v2/.env**

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_CLIENT_SLUG=pr-watches-gadgets
VITE_CLIENT_ID=client-watches-1
```

## 6. Vercel

Add the same `VITE_*` variables to both admin and watches Vercel projects.
