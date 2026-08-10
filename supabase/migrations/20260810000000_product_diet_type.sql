-- Restaurant menu items: explicit veg / non-veg marker (nullable for legacy rows).
alter table public.products
  add column if not exists diet_type text check (diet_type is null or diet_type in ('veg', 'non-veg'));
