-- Store country drives currency and regional formatting in admin + storefronts.

alter table public.clients
  add column if not exists country text not null default 'IN';

comment on column public.clients.country is 'ISO 3166-1 alpha-2 (IN, US, GB, AE). Drives display currency.';

-- Backfill US for liquor templates created before this column existed.
update public.clients
set country = 'US'
where country = 'IN' and template like 'liquor-store%';
