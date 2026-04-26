-- ============================================
-- Resona E-Commerce Database Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. Profiles (extends auth.users)
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  phone text,
  avatar_url text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  stripe_customer_id text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Categories
create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  parent_id uuid references public.categories(id),
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- 3. Collections
create table public.collections (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- 4. Products
create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  category_id uuid references public.categories(id),
  base_price decimal(10,2) not null,
  compare_at_price decimal(10,2),
  currency text not null default 'USD',
  is_active boolean not null default true,
  is_featured boolean not null default false,
  metadata jsonb default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 5. Product-Collection junction
create table public.product_collections (
  product_id uuid references public.products(id) on delete cascade,
  collection_id uuid references public.collections(id) on delete cascade,
  primary key (product_id, collection_id)
);

-- 6. Product Variants
create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  sku text unique,
  size text not null,
  color text not null,
  price_override decimal(10,2),
  stock_quantity int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- 7. Product Images
create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  url text not null,
  alt_text text,
  sort_order int not null default 0,
  is_primary boolean not null default false
);

-- 8. Addresses
create table public.addresses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  full_name text not null,
  line1 text not null,
  line2 text,
  city text not null,
  state text,
  postal_code text not null,
  country text not null default 'SG',
  phone text,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);

-- 9. Orders
create table public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id),
  order_number text not null unique,
  status text not null default 'pending'
    check (status in ('pending','confirmed','processing','shipped','delivered','cancelled','refunded')),
  subtotal decimal(10,2) not null,
  shipping_cost decimal(10,2) not null default 0,
  tax decimal(10,2) not null default 0,
  total decimal(10,2) not null,
  currency text not null default 'USD',
  shipping_address jsonb not null,
  billing_address jsonb,
  stripe_checkout_session_id text,
  stripe_payment_intent_id text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 10. Order Items
create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id),
  variant_id uuid references public.product_variants(id),
  product_name text not null,
  variant_label text,
  quantity int not null,
  unit_price decimal(10,2) not null,
  total decimal(10,2) not null
);

-- 11. Reviews
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  user_id uuid not null references public.profiles(id),
  rating int not null check (rating between 1 and 5),
  title text,
  body text,
  is_verified boolean not null default false,
  created_at timestamptz not null default now()
);

-- 12. Wishlist
create table public.wishlist_items (
  user_id uuid references public.profiles(id) on delete cascade,
  product_id uuid references public.products(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, product_id)
);

-- ============================================
-- Indexes
-- ============================================
create index idx_products_category on public.products(category_id);
create index idx_products_slug on public.products(slug);
create index idx_products_active on public.products(is_active) where is_active = true;
create index idx_products_featured on public.products(is_featured) where is_featured = true;
create index idx_variants_product on public.product_variants(product_id);
create index idx_images_product on public.product_images(product_id);
create index idx_orders_user on public.orders(user_id);
create index idx_orders_status on public.orders(status);
create index idx_order_items_order on public.order_items(order_id);
create index idx_reviews_product on public.reviews(product_id);
create index idx_addresses_user on public.addresses(user_id);

-- ============================================
-- Functions
-- ============================================

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Generate order number
create or replace function public.generate_order_number()
returns trigger as $$
begin
  new.order_number := 'RSN-' || to_char(now(), 'YYYYMMDD') || '-' ||
    lpad(floor(random() * 10000)::text, 4, '0');
  return new;
end;
$$ language plpgsql;

create trigger set_order_number
  before insert on public.orders
  for each row when (new.order_number is null)
  execute function public.generate_order_number();

-- Auto-update updated_at
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at();

create trigger update_products_updated_at
  before update on public.products
  for each row execute function public.update_updated_at();

create trigger update_orders_updated_at
  before update on public.orders
  for each row execute function public.update_updated_at();

-- ============================================
-- Row Level Security
-- ============================================

-- Helper: check if current user is admin
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

-- Profiles
alter table public.profiles enable row level security;
create policy "Users read own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users update own profile" on public.profiles
  for update using (auth.uid() = id);
create policy "Admins read all profiles" on public.profiles
  for select using (public.is_admin());
create policy "Admins update all profiles" on public.profiles
  for update using (public.is_admin());

-- Categories (public read, admin write)
alter table public.categories enable row level security;
create policy "Public read categories" on public.categories
  for select using (true);
create policy "Admin manage categories" on public.categories
  for all using (public.is_admin());

-- Collections (public read active, admin all)
alter table public.collections enable row level security;
create policy "Public read active collections" on public.collections
  for select using (is_active = true);
create policy "Admin manage collections" on public.collections
  for all using (public.is_admin());

-- Products (public read active, admin all)
alter table public.products enable row level security;
create policy "Public read active products" on public.products
  for select using (is_active = true);
create policy "Admin manage products" on public.products
  for all using (public.is_admin());

-- Product Collections (public read, admin write)
alter table public.product_collections enable row level security;
create policy "Public read product_collections" on public.product_collections
  for select using (true);
create policy "Admin manage product_collections" on public.product_collections
  for all using (public.is_admin());

-- Product Variants (public read active, admin all)
alter table public.product_variants enable row level security;
create policy "Public read active variants" on public.product_variants
  for select using (is_active = true);
create policy "Admin manage variants" on public.product_variants
  for all using (public.is_admin());

-- Product Images (public read, admin write)
alter table public.product_images enable row level security;
create policy "Public read images" on public.product_images
  for select using (true);
create policy "Admin manage images" on public.product_images
  for all using (public.is_admin());

-- Addresses (user own, admin all)
alter table public.addresses enable row level security;
create policy "Users manage own addresses" on public.addresses
  for all using (auth.uid() = user_id);
create policy "Admin read all addresses" on public.addresses
  for select using (public.is_admin());

-- Orders (user own read, admin all)
alter table public.orders enable row level security;
create policy "Users read own orders" on public.orders
  for select using (auth.uid() = user_id);
create policy "Admin manage orders" on public.orders
  for all using (public.is_admin());
create policy "Service role insert orders" on public.orders
  for insert with check (true);

-- Order Items (user read via order, admin all)
alter table public.order_items enable row level security;
create policy "Users read own order items" on public.order_items
  for select using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
      and orders.user_id = auth.uid()
    )
  );
create policy "Admin manage order items" on public.order_items
  for all using (public.is_admin());
create policy "Service role insert order items" on public.order_items
  for insert with check (true);

-- Reviews (public read, user create own, admin all)
alter table public.reviews enable row level security;
create policy "Public read reviews" on public.reviews
  for select using (true);
create policy "Users create own reviews" on public.reviews
  for insert with check (auth.uid() = user_id);
create policy "Users update own reviews" on public.reviews
  for update using (auth.uid() = user_id);
create policy "Users delete own reviews" on public.reviews
  for delete using (auth.uid() = user_id);
create policy "Admin manage reviews" on public.reviews
  for all using (public.is_admin());

-- Wishlist (user own)
alter table public.wishlist_items enable row level security;
create policy "Users manage own wishlist" on public.wishlist_items
  for all using (auth.uid() = user_id);

-- ============================================
-- Storage bucket for product images
-- ============================================
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict do nothing;

create policy "Public read product images" on storage.objects
  for select using (bucket_id = 'product-images');
create policy "Admin upload product images" on storage.objects
  for insert with check (bucket_id = 'product-images' and public.is_admin());
create policy "Admin delete product images" on storage.objects
  for delete using (bucket_id = 'product-images' and public.is_admin());
