# My Agency — Multi-Client Web Platform

## Overview

This platform is built for an agency that ships **modern websites for Indian local businesses** (mobile stores, salons, restaurants). Admin UI lives in **`packages/admin-ui`** and is embedded at **`/admin`** on each storefront. One codebase can be white-labeled per client via config and Supabase data.

---

## Monorepo structure

The repo is an **npm workspaces** monorepo:

| Workspace | Role | Admin URL (local) |
|-----------|------|-------------------|
| **`packages/admin-ui/`** | Shared admin SPA (`AdminApp`, auth, catalog CRUD) | (imported by storefronts) |
| **`client/`** | Mobile Store **mobile storefront** | http://localhost:5173/admin |
| **`liquor-store-v1/`** | **Liquor storefront** | http://localhost:3000/admin |
| **`watches-store-v2/`** | **Watches storefront** | http://localhost:3002/admin |
| **`server/`** | **API** (Express + TypeScript) | — |

Use `npm run dev:liquor` / `npm run build:liquor` and `npm run dev:watches` / `npm run build:watches` from the repo root.

### Folder tree

```text
my-agency/
├── package.json                 # workspaces + root scripts
├── package-lock.json
├── README.md
├── liquor-store-v1/             # Vite + React template (liquor)
│   ├── src/
│   │   ├── App.tsx              # Routes: /, /shop, /spirits, /wine, /beer + age gate
│   │   ├── pages/
│   │   ├── components/
│   │   └── data/
│   ├── package.json
│   └── vite.config.ts
├── watches-store-v2/            # Vite + React template (watches; from Downloads/pr-watches)
│   ├── src/
│   │   ├── App.tsx              # Routes: /, /watches, /toys, /accessories, /visit
│   │   ├── pages/
│   │   └── components/
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
├── client/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.ts       # reads colors/fonts from client-config
│   ├── postcss.config.js
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   ├── .eslintrc.cjs
│   └── src/
│       ├── App.tsx
│       ├── index.tsx
│       ├── index.css
│       ├── config/
│       │   ├── client-config.ts    # brand, contact, theme, WhatsApp helper
│       │   └── clientSelectStyles.ts
│       ├── data/
│       │   ├── phones.ts
│       │   └── accessories.ts
│       ├── components/
│       │   ├── AccessoryTileCard.tsx
│       │   ├── FeaturedPhones.tsx
│       │   ├── Footer.tsx
│       │   ├── Hero.tsx
│       │   ├── InstagramStrip.tsx
│       │   ├── Navbar.tsx
│       │   ├── PhoneCard.tsx
│       │   ├── Services.tsx
│       │   ├── SocialProof.tsx
│       │   ├── VisitUs.tsx
│       │   ├── WhatsAppFAB.tsx
│       │   └── WhyChooseUs.tsx
│       └── pages/
│           ├── Home.tsx
│           ├── AllPhones.tsx
│           ├── Accessories.tsx
│           └── AccessoriesCategory.tsx
├── admin/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts           # dev server port 5174
│   ├── tailwind.config.ts
│   ├── postcss.config.js
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── src/
│       ├── App.tsx
│       ├── main.tsx
│       ├── index.css
│       ├── vite-env.d.ts
│       ├── context/
│       │   └── AdminDataContext.tsx
│       ├── mock/
│       │   ├── clients.ts
│       │   └── products.ts
│       ├── components/
│       │   ├── AdminSkeleton.tsx
│       │   ├── ConfirmModal.tsx
│       │   ├── Layout.tsx
│       │   ├── PageTransition.tsx
│       │   ├── ProductModal.tsx
│       │   ├── ProtectedRoute.tsx
│       │   └── Sidebar.tsx
│       ├── pages/
│       │   ├── Login.tsx
│       │   ├── Dashboard.tsx
│       │   ├── Clients.tsx
│       │   ├── ClientDetail.tsx
│       │   ├── CreateClient.tsx
│       │   ├── Billing.tsx
│       │   ├── Products.tsx
│       │   ├── Accessories.tsx
│       │   ├── StoreInfo.tsx
│       │   └── ChangePassword.tsx
│       └── utils/
│           ├── jwt.ts
│           ├── showToast.ts
│           ├── dateDisplay.ts
│           └── adminSelectStyles.ts
└── server/
    ├── package.json
    ├── tsconfig.json
    ├── .env.example
    └── src/
        └── index.ts
```

---

## Tech stack

| Layer | Technology | Notes |
|-------|------------|--------|
| **Monorepo** | npm workspaces | Root `package.json` orchestrates `client`, `admin`, `server`. |
| **Client UI** | React 18, Vite 5, TypeScript | SPA storefront. |
| **Client styling** | Tailwind CSS 3.4 | Theme tokens sourced from `client/src/config/client-config.ts`. |
| **Client motion** | Framer Motion | List/grid animations, `AnimatePresence` on filters. |
| **Client routing** | react-router-dom v6 | Browser router; routes in `client/src/App.tsx`. |
| **Client UX** | @headlessui/react | `Disclosure` mobile nav in `Navbar`. |
| **Client forms / selects** | react-select | Sort and filter dropdowns; dark theme via `clientSelectStyles`. |
| **Client feedback** | react-hot-toast | WhatsApp FAB / card actions. |
| **Client dates** | date-fns | Used where date formatting is needed in client code. |
| **Client icons** | lucide-react | Consistent icon set. |
| **Client (declared)** | @emotion/react | Listed in `client/package.json` (align usage or remove if unused). |
| **Admin UI** | React 18, Vite 5, TypeScript | SPA admin; dev port **5174** in `admin/vite.config.ts`. |
| **Admin styling** | Tailwind CSS 3.4 | Tokens aligned with storefront (`admin/tailwind.config.ts`). |
| **Admin routing** | react-router-dom v6 | Role-gated routes in `admin/src/App.tsx`. |
| **Admin tables** | @tanstack/react-table | Clients, products, accessories tables. |
| **Admin forms** | react-hook-form | Create client, modals, store info, login-style flows. |
| **Admin modals** | @headlessui/react | `ConfirmModal`, `ProductModal` (`Dialog` API). |
| **Admin selects** | react-select | Styled via `adminSelectStyles`. |
| **Admin loading UI** | react-loading-skeleton | Table/card skeletons (`AdminSkeleton`). |
| **Admin feedback** | react-hot-toast | Wrapped via `showToast` utility. |
| **Admin dates** | date-fns | Display helpers in `dateDisplay.ts`. |
| **Admin motion** | CSS transitions | `PageTransition` (200ms fade + slide); **no** `framer-motion` in admin deps. |
| **Admin icons** | lucide-react | Sidebar, actions, KPIs. |
| **Server** | Express 4, TypeScript, tsx | `tsx watch` in dev; `tsc` build to `dist/`. |
| **Server data** | Mongoose 8 | Connected at startup; health reflects connection state. |
| **Server config** | dotenv, cors | `.env` for `PORT`, `MONGODB_URI`. |

**Packages you called out:** `react-hot-toast`, `@headlessui/react`, `react-hook-form`, `@tanstack/react-table`, `date-fns`, `react-select`, `react-loading-skeleton`, and **`framer-motion`** are used as above; **`framer-motion` is storefront (`client/`) only** in this repo.

---

## Getting started

### Prerequisites

- **Node.js** (LTS recommended) and **npm**
- Optional for full server health: **MongoDB** locally or **MongoDB Atlas** URI

### Clone and install

```bash
git clone <your-repo-url>
cd my-agency
npm install
```

### Environment (server)

Copy `server/.env.example` to `server/.env` and adjust values (see [Environment variables](#environment-variables)).

### Commands

| Command | What it runs | Default URL |
|---------|----------------|---------------|
| `npm run dev:client` | Mobile Store storefront | **http://localhost:5173** (+ `/admin`) |
| `npm run dev:liquor` | Liquor storefront | **http://localhost:3000** (+ `/admin`) |
| `npm run dev:watches` | Watches storefront | **http://localhost:3002** (+ `/admin`) |
| `npm run dev:server` | Express API with `tsx watch` | **http://localhost:4000** |
| `npm run seed:bala` | Seed `client-bala-1` + catalog in Supabase | (requires root `.env`) |
| `npm run build` | client + liquor + watches + server | All `dist/` outputs |

---

## Storefront (`client/`)

### What it does

Static, high-conversion **catalog + lead gen** site: phones and accessories, filters, WhatsApp CTAs, and sections (hero, services, visit, social proof) driven by **`client-config.ts`** and **`src/data/*`**.

### Pages

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `Home` | Landing: hero, featured phones, services, proof, Instagram strip, visit, footer. |
| `/phones` | `AllPhones` | Full catalog with sticky filter sidebar, brand/price filters, search, sort (`react-select`). |
| `/accessories` | `Accessories` | Accessory catalog hub. |
| `/accessories/:categoryId` | `AccessoriesCategory` | Accessories filtered by category slug/id. |

### Components

| Component | Description |
|-----------|-------------|
| `Navbar` | Fixed top nav, wordmark from config, desktop links, **Headless UI `Disclosure`** mobile menu, WhatsApp shortcut. |
| `Footer` | Brand, links, contact from `client-config`. |
| `Hero` | Above-the-fold headline and primary CTAs. |
| `FeaturedPhones` | Horizontal scroll strip of highlighted devices. |
| `PhoneCard` | Product card with price/EMI, **Framer Motion** stagger, pre-filled **WhatsApp** messages, toast on open. |
| `AccessoryTileCard` | Tile layout for accessory categories/items. |
| `Services` | Service highlights section. |
| `WhyChooseUs` | Value props / trust section. |
| `SocialProof` | Reviews or social proof block. |
| `InstagramStrip` | Social / gallery strip. |
| `VisitUs` | Address and map-style card from config. |
| `WhatsAppFAB` | Sticky floating action for WhatsApp with toast feedback. |

### Features (checklist)

- Responsive layout (**375px** through large breakpoints / 2xl-style max-width containers)
- **Sticky filter sidebar** on listing pages (e.g. All Phones)
- **Brand + price** filters and search
- **Sort** via **react-select**
- **Horizontal scroll** featured phones
- **WhatsApp CTA** on product/accessory cards
- **Sticky WhatsApp FAB** with **react-hot-toast**
- **Mobile hamburger** nav via **@headlessui/react**
- **Framer Motion** for card and list motion
- **Google Fonts:** **Bebas Neue** + **Inter** (import URL kept in sync with `client-config.ts` and `index.css`)

---

## Admin panel (`admin/`)

### What it does

Internal **agency operations** (clients, billing, onboarding) plus **per-store** catalog and store settings. Data is **in-memory mock** today (`AdminDataContext` + `mock/*`); resets on refresh until Phase 2.

### Auth

- **JWT-shaped tokens** stored in `localStorage` (`admin_jwt`) — **mock only**: Base64 header/payload, **not cryptographically verified** (`utils/jwt.ts`).
- **Roles:** `superadmin` | `admin` (`JwtPayload` in `jwt.ts`).
- **Superadmin detection (mock login):** email starts with `superadmin` or equals `super@agency.com`.
- **Store admin:** everyone else gets `role: 'admin'` and `clientId: 'client-1'` in the mock payload.
- **First login:** if email contains `firstlogin`, JWT includes `firstLogin: true` → forced **`/change-password`** before other admin routes (`Layout` + `Login` redirects).
- **Protected routes:** `ProtectedRoute` requires a token; **superadmin-only** and **admin-only** wrappers in `App.tsx` redirect by role.

### Superadmin features

- **Dashboard** — KPI-style cards, activity-style feed, clients needing attention (from mock clients).
- **All clients** (`/clients`) — **TanStack Table**: status, live URL, search.
- **Client detail** (`/clients/:clientId`) — store profile, billing summary, danger/destructive actions area.
- **Create client** (`/create-client`) — **react-hook-form**, **auto-generated temp password**, **live URL** string from slug (`https://{slug}.example.com`), template picker.
- **Billing** (`/billing`) — MRR-style rollups, overdue indicators, payment history (mock).

### Admin (store owner) features

- **Dashboard** — summary cards, **store completeness** / setup checklist, **stock** style alerts from mock counts.
- **Products** (`/products`) — CRUD via context + **ProductModal**, search/filter/sort, bulk actions, image preview in table/modal.
- **Accessories** (`/accessories`) — Same patterns as products.
- **Store info** (`/store-info`) — WhatsApp, address, timings, Instagram, etc.
- **Change password** (`/change-password`) — first-login and voluntary updates (mock; updates token flags in app flow).
- **Preview store** — header/sidebar uses **`liveUrl`** from the client row matching JWT `clientId`; opens in a **new tab** when set.

### UI quality

- Mobile responsive from **375px+**
- **react-hot-toast** (styled in `main.tsx`)
- **@headlessui/react** modals (`ConfirmModal`, `ProductModal`)
- **react-select** for dropdowns
- **react-hook-form** validation on forms
- **@tanstack/react-table** for data tables
- **date-fns** for readable dates (`dateDisplay.ts`)
- **react-loading-skeleton** via `AdminSkeleton`
- **Page transitions** — **200ms** opacity + translate (`PageTransition.tsx`)
- Empty states on list-style pages where implemented
- Loading skeletons on heavy tables
- Delete flows use **confirmation modals**
- **Sticky sidebar** on desktop; **mobile drawer** + overlay (`Sidebar` + `Layout`)

### Design system (tokens)

| Token | Value / usage |
|-------|----------------|
| **Background** (`bg` / `brand-bg`) | `#0A0A0A` |
| **Card** (`brand-card`) | `#1A1A2E` |
| **Accent (saffron)** | `#FF6B00` (hover `#ff8533`) |
| **Sidebar surface** (admin) | `#111111` (`surface.sidebar`) |
| **Display font** | Bebas Neue (`font-display`) |
| **Body font** | Inter (`font-sans`) |

Storefront pulls brand colors/fonts from **`client/src/config/client-config.ts`**; admin mirrors them in Tailwind for consistency.

---

## Server (`server/`)

### Current state

- **`GET /api/health`** — returns `{ ok, mongo }` where `mongo` is `connected` | `disconnected` based on Mongoose ready state.
- **MongoDB** — `mongoose.connect` on startup using `MONGODB_URI` (see `.env.example`).

### Planned (Phase 2) — routes & models (illustrative)

**Auth**

- `POST /api/auth/login`, `POST /api/auth/logout`, `POST /api/auth/refresh`
- `POST /api/auth/change-password` (first-login + authenticated)

**Agency / superadmin**

- `GET/POST /api/clients`, `GET/PATCH/DELETE /api/clients/:id`
- `GET /api/billing/summary`, `GET /api/clients/:id/billing`, `POST /api/invoices` (or payment webhooks)

**Store admin (scoped by `clientId`)**

- `GET/PATCH /api/clients/:id/store` (WhatsApp, address, hours, socials)
- `GET/POST/PATCH/DELETE /api/clients/:id/products`
- `GET/POST/PATCH/DELETE /api/clients/:id/accessories`
- `POST /api/clients/:id/media` (uploaded image URLs)

**Models (Mongo / Mongoose)**

- `User` (email, password hash, role, `clientId?`, `firstLogin`)
- `Client` (store metadata, template key, billing, `liveUrl`, status)
- `Product`, `Accessory` (catalog items, images, stock, pricing)
- `Payment` / `Invoice` (billing history, optional)

Exact shapes should follow whatever you persist from today’s mock types in `admin/src/mock/*`.

---

## Architecture

### Multi-client

- **Pattern:** each business is a **`Client`** record with **`id`** (e.g. `client-1`). Store admins carry **`clientId`** in the JWT payload so APIs (Phase 2) can scope queries: **one database**, **namespaced by `clientId`** (and strict server-side checks).
- **Today:** admin JWT for store users hardcodes **`client-1`** in mock login; storefront does not read JWT — it is **single-tenant static** until dynamic hosting + API land.

### Auth flow (JWT payload)

| Field | `superadmin` | `admin` |
|-------|----------------|--------|
| `role` | `superadmin` | `admin` |
| `email` | set | set |
| `clientId` | omitted | required for scoped UI (`client-1` mock) |
| `firstLogin` | typically omitted | optional; when `true`, forces password change |

### Template system

- **`client/src/config/client-config.ts`** is the **white-label source**: brand names, WhatsApp E.164, address lines, theme colors, font stacks, and Google Fonts URL.
- **Admin `CreateClient`** persists a **`template`** string chosen from: `mobile-store-v1`, `mobile-store-v2`, `salon-v1`, `restaurant-v1` (see `CreateClient.tsx`). Phase 2 can map `template` → which **client** bundle, feature flags, or CSS preset to deploy for that client’s hosted storefront.

---

## Deployment

| Artifact | Suggested host | Notes |
|----------|----------------|--------|
| `client/` | **Vercel** (free tier) | Static SPA; configure SPA fallback to `index.html`. |
| `admin/` | **Vercel** (separate project) | Keep admin on its own origin for security and RBAC. |
| `server/` | **Railway** (or similar) | Set `PORT`, `MONGODB_URI`, CORS allowlist for admin + storefront origins. |
| **Database** | **MongoDB Atlas** (free **512MB** tier) | Set `MONGODB_URI` in Railway env. |

---

## CI/CD Pipeline

During setup, **only** `ci.yml` and `pr-check.yml` run automatically on push/PR. The three **deploy** workflows are **manual** (GitHub → **Actions** → pick the workflow → **Run workflow**) so nothing hits Vercel or Railway until you add secrets and choose to run a deploy. When you want deploy-on-merge, uncomment or add the `push` block described at the top of each `deploy-*.yml`.

### Workflows

| Workflow | Trigger | What it does |
|----------|---------|--------------|
| ci.yml | Every push + PR | Lint + build all workspaces |
| deploy-client.yml | Manual (workflow dispatch) | Deploy storefront to Vercel |
| deploy-admin.yml | Manual (workflow dispatch) | Deploy admin to Vercel |
| deploy-server.yml | Manual (workflow dispatch) | Deploy API to Railway |
| pr-check.yml | Every PR to main | Build check + console.log scan |

### GitHub Secrets Required

When you start deploying, add these under GitHub repo → Settings → Secrets → Actions

| Secret | Where to get it |
|--------|-----------------|
| VERCEL_TOKEN | Vercel dashboard → Settings → Tokens |
| VERCEL_ORG_ID | Vercel dashboard → Settings → General |
| VERCEL_CLIENT_PROJECT_ID | Vercel project → Settings → General |
| VERCEL_ADMIN_PROJECT_ID | Vercel project → Settings → General |
| RAILWAY_TOKEN | Railway dashboard → Account → Tokens |

---

## Roadmap

| Phase | Status | Scope |
|-------|--------|--------|
| **1** | Done | Static storefront + monorepo + mock admin + health-only API |
| **2** | In progress / next | Real backend, persisted data, verified JWT, dynamic catalog |
| **3** | Planned | Scale: billing automation, niche templates, SEO hardening |
| **4** | Planned | Agency scale: SSR where needed, contractors, white-label |

---

## Environment variables

### `server/.env.example`

```env
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/my-agency
```

| Variable | Purpose |
|----------|---------|
| **`PORT`** | HTTP port for Express (default **4000** if unset in code). |
| **`MONGODB_URI`** | Full Mongo connection string (local `mongod` or **Atlas** SRV URI with user/password and TLS). |

---

## Known limitations (current)

- **JWT is mock only** — Base64-decoded payload; **no signature verification** and not safe for production.
- **All admin data is client-side mock** — **resets on full page reload**; no DB writes yet.
- **Store admin `clientId`** is **hardcoded to `client-1`** in mock login.
- **Images** use **remote URLs** (e.g. Unsplash-style catalog) — **hotlinking** or upstream rate limits can break thumbnails in real deployments unless you self-host or use a CDN.

---

## Team

| Area | Owner |
|------|--------|
| **Frontend** | Pavansai |
| **Backend** | TBD |
| **QA** | Chinni Dasari (regression + smoke testing) |

---

## Credits

Early `client/` scaffolding referenced a [Magic Patterns](https://magicpatterns.com) export; the product documentation above reflects the **My Agency** monorepo as it exists in this repository.
