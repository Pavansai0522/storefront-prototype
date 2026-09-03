-- Watches storefront: up to 5 product photos. image_url remains the catalog thumbnail (first photo).
alter table public.products
  add column if not exists images text[] not null default '{}'::text[];

alter table public.products
  drop constraint if exists products_images_len;

alter table public.products
  add constraint products_images_len check (cardinality(images) <= 5);
