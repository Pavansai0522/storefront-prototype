-- Allow liquor weekly specials via products.featured_group = 'deal'
alter table public.products drop constraint if exists products_featured_group_check;

alter table public.products
  add constraint products_featured_group_check
  check (featured_group is null or featured_group in ('watch', 'toy', 'accessory', 'deal'));
