-- Watches storefront: optional product description shown on the detail page.
alter table public.products
  add column if not exists description text not null default ''::text;
