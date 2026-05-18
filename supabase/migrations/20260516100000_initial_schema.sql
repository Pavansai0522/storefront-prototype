-- Agency multi-tenant schema for PR Watches production (Supabase)

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null default '',
  role text not null check (role in ('superadmin', 'admin')),
  client_id text,
  must_change_password boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index profiles_client_id_idx on public.profiles (client_id);

-- ---------------------------------------------------------------------------
-- clients
-- ---------------------------------------------------------------------------
create table public.clients (
  id text primary key,
  slug text not null unique,
  country text not null default 'IN',
  template text not null,
  store_name text not null,
  status text not null default 'active' check (status in ('active', 'suspended', 'trial')),
  monthly_fee numeric not null default 0,
  live_url text not null default '',
  whatsapp_number text not null default '',
  store_phone text not null default '',
  address text not null default '',
  primary_color text not null default '#6C3FE8',
  logo_url text not null default '',
  admin_email text not null default '',
  admin_temp_password text not null default '',
  admin_last_login_at timestamptz,
  products_count int not null default 0,
  products_last_updated_at timestamptz,
  accessories_last_updated_at timestamptz,
  site_active boolean not null default true,
  billing jsonb not null default '{}'::jsonb,
  instagram text not null default '',
  facebook text not null default '',
  timings text not null default '',
  age_verification_enabled boolean not null default false,
  delivery_available boolean not null default false,
  delivery_radius_miles numeric not null default 0,
  minimum_order_amount_usd numeric not null default 0,
  notes jsonb not null default '[]'::jsonb,
  public_config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index clients_slug_idx on public.clients (slug);
create index clients_site_active_idx on public.clients (site_active);

-- ---------------------------------------------------------------------------
-- products
-- ---------------------------------------------------------------------------
create table public.products (
  id uuid primary key default gen_random_uuid(),
  client_id text not null references public.clients (id) on delete cascade,
  name text not null,
  brand text not null,
  price_inr int not null,
  emi_price_inr int,
  image_url text,
  in_stock boolean not null default true,
  category text not null default '',
  subcategory text,
  is_accessory boolean not null default false,
  featured_group text check (featured_group is null or featured_group in ('watch', 'toy', 'accessory')),
  featured_sort int,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_client_id_idx on public.products (client_id);
create index products_subcategory_idx on public.products (client_id, subcategory);
create index products_featured_idx on public.products (client_id, featured_group, featured_sort);

-- ---------------------------------------------------------------------------
-- helpers for RLS
-- ---------------------------------------------------------------------------
create or replace function public.is_superadmin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'superadmin'
  );
$$;

create or replace function public.user_client_id()
returns text
language sql
stable
security definer
set search_path = public
as $$
  select client_id from public.profiles where id = auth.uid();
$$;

create or replace function public.client_is_public_active(p_client_id text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.clients c
    where c.id = p_client_id and c.site_active = true
  );
$$;

-- ---------------------------------------------------------------------------
-- updated_at trigger
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

create trigger clients_updated_at
  before update on public.clients
  for each row execute function public.set_updated_at();

create trigger products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- auth: auto-create profile
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, coalesce(new.email, ''), 'admin');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.clients enable row level security;
alter table public.products enable row level security;

-- profiles
create policy profiles_select_own on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.is_superadmin());

create policy profiles_update_own on public.profiles
  for update to authenticated
  using (id = auth.uid() or public.is_superadmin())
  with check (id = auth.uid() or public.is_superadmin());

-- clients: public read active stores; admins read own; superadmin all
create policy clients_select_public on public.clients
  for select to anon
  using (site_active = true);

create policy clients_select_authenticated on public.clients
  for select to authenticated
  using (
    public.is_superadmin()
    or id = public.user_client_id()
    or site_active = true
  );

create policy clients_update_admin on public.clients
  for update to authenticated
  using (public.is_superadmin() or id = public.user_client_id())
  with check (public.is_superadmin() or id = public.user_client_id());

create policy clients_insert_superadmin on public.clients
  for insert to authenticated
  with check (public.is_superadmin());

create policy clients_delete_superadmin on public.clients
  for delete to authenticated
  using (public.is_superadmin());

-- products: public read when client active
create policy products_select_public on public.products
  for select to anon
  using (public.client_is_public_active(client_id));

create policy products_select_authenticated on public.products
  for select to authenticated
  using (
    public.is_superadmin()
    or client_id = public.user_client_id()
    or public.client_is_public_active(client_id)
  );

create policy products_insert_admin on public.products
  for insert to authenticated
  with check (
    public.is_superadmin()
    or client_id = public.user_client_id()
  );

create policy products_update_admin on public.products
  for update to authenticated
  using (
    public.is_superadmin()
    or client_id = public.user_client_id()
  )
  with check (
    public.is_superadmin()
    or client_id = public.user_client_id()
  );

create policy products_delete_admin on public.products
  for delete to authenticated
  using (
    public.is_superadmin()
    or client_id = public.user_client_id()
  );

-- ---------------------------------------------------------------------------
-- storage: product-images bucket
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create or replace function public.storage_client_prefix(object_name text)
returns text
language sql
immutable
as $$
  select split_part(object_name, '/', 1);
$$;

create policy product_images_public_read on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'product-images');

create policy product_images_insert_admin on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'product-images'
    and (
      public.is_superadmin()
      or public.storage_client_prefix(name) = public.user_client_id()
    )
  );

create policy product_images_update_admin on storage.objects
  for update to authenticated
  using (
    bucket_id = 'product-images'
    and (
      public.is_superadmin()
      or public.storage_client_prefix(name) = public.user_client_id()
    )
  );

create policy product_images_delete_admin on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'product-images'
    and (
      public.is_superadmin()
      or public.storage_client_prefix(name) = public.user_client_id()
    )
  );
