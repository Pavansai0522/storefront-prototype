-- Allow up to 5 selectable product colors.
alter table public.products
  drop constraint if exists products_colors_len;

alter table public.products
  add constraint products_colors_len check (cardinality(colors) <= 5);
