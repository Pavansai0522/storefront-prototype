-- Customer orders for storefront checkout (Razorpay India)

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  client_id text not null references public.clients (id) on delete cascade,
  customer_name text not null,
  customer_email text not null default '',
  customer_phone text not null,
  address_line text not null default '',
  landmark text not null default '',
  postal_code text not null default '',
  city text not null default '',
  state text not null default '',
  country text not null default 'India',
  notes text not null default '',
  subtotal_inr int not null,
  delivery_inr int not null default 0,
  total_inr int not null,
  status text not null default 'pending'
    check (status in ('pending', 'paid', 'failed', 'cancelled')),
  razorpay_order_id text,
  razorpay_payment_id text,
  razorpay_signature text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index orders_client_id_idx on public.orders (client_id);
create index orders_status_idx on public.orders (client_id, status);
create index orders_razorpay_order_id_idx on public.orders (razorpay_order_id);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id uuid not null references public.products (id) on delete restrict,
  name text not null,
  brand text not null,
  unit_price_inr int not null,
  qty int not null check (qty > 0),
  created_at timestamptz not null default now()
);

create index order_items_order_id_idx on public.order_items (order_id);

create trigger orders_updated_at
  before update on public.orders
  for each row execute function public.set_updated_at();

alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Store admins can read their client orders (future admin UI)
create policy orders_select_admin on public.orders
  for select to authenticated
  using (public.is_superadmin() or client_id = public.user_client_id());

create policy order_items_select_admin on public.order_items
  for select to authenticated
  using (
    public.is_superadmin()
    or exists (
      select 1 from public.orders o
      where o.id = order_items.order_id
        and o.client_id = public.user_client_id()
    )
  );
