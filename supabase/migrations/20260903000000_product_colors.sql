-- Watches storefront: up to 3 selectable product colors (hex).
alter table public.products
  add column if not exists colors text[] not null default '{}'::text[];

alter table public.products
  drop constraint if exists products_colors_len;

alter table public.products
  add constraint products_colors_len check (cardinality(colors) <= 3);
