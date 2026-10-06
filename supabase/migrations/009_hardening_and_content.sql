-- Security hardening, order-flow fixes, and admin-editable storefront content

-- ============================================
-- 1. Customers must not be able to change their own role
-- ============================================
create or replace function public.protect_profile_columns()
returns trigger as $$
begin
  -- auth.uid() is null for the service role / SQL editor, which stay unrestricted
  if auth.uid() is not null and not public.is_admin() then
    new.role := old.role;
    new.stripe_customer_id := old.stripe_customer_id;
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

drop trigger if exists protect_profile_columns on public.profiles;
create trigger protect_profile_columns
  before update on public.profiles
  for each row execute function public.protect_profile_columns();

-- ============================================
-- 2. Orders are only ever created server-side with the service role,
--    which bypasses RLS. These policies let anyone insert arbitrary orders.
-- ============================================
drop policy if exists "Service role insert orders" on public.orders;
drop policy if exists "Service role insert order items" on public.order_items;

-- ============================================
-- 3. Stock adjustments: server-side only
-- ============================================
create or replace function public.adjust_stock(
  p_variant_id uuid,
  p_delta int
)
returns void as $$
begin
  update public.product_variants
  set stock_quantity = greatest(stock_quantity + p_delta, 0)
  where id = p_variant_id;
end;
$$ language plpgsql security definer set search_path = public;

revoke execute on function public.adjust_stock(uuid, int) from public, anon, authenticated;
revoke execute on function public.deduct_stock(uuid, int) from public, anon, authenticated;
grant execute on function public.adjust_stock(uuid, int) to service_role;
grant execute on function public.deduct_stock(uuid, int) to service_role;

-- ============================================
-- 4. Partial refunds are written by the Stripe webhook
-- ============================================
alter table public.orders drop constraint if exists orders_status_check;
alter table public.orders add constraint orders_status_check
  check (status in (
    'pending','confirmed','processing','shipped','delivered','cancelled',
    'refund_requested','partially_refunded','refunded'
  ));

create index if not exists idx_orders_checkout_session
  on public.orders(stripe_checkout_session_id);
create index if not exists idx_orders_payment_intent
  on public.orders(stripe_payment_intent_id);

-- ============================================
-- 5. Vietnamese copy editable from the admin
-- ============================================
alter table public.products add column if not exists name_vi text;
alter table public.products add column if not exists description_vi text;
alter table public.collections add column if not exists name_vi text;
alter table public.collections add column if not exists description_vi text;
alter table public.categories add column if not exists name_vi text;

-- ============================================
-- 6. One review per customer per product
-- ============================================
create unique index if not exists idx_reviews_product_user
  on public.reviews(product_id, user_id);

-- ============================================
-- 7. Newsletter: admins can remove subscribers
-- ============================================
drop policy if exists "Admin delete subscribers" on public.newsletter_subscribers;
create policy "Admin delete subscribers" on public.newsletter_subscribers
  for delete using (public.is_admin());

-- ============================================
-- 8. Site settings (announcement bar, ...)
-- ============================================
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '{}',
  updated_at timestamptz not null default now()
);

alter table public.site_settings enable row level security;

drop policy if exists "Public read site settings" on public.site_settings;
create policy "Public read site settings" on public.site_settings
  for select using (true);
drop policy if exists "Admin manage site settings" on public.site_settings;
create policy "Admin manage site settings" on public.site_settings
  for all using (public.is_admin());

insert into public.site_settings (key, value)
values (
  'announcement',
  jsonb_build_object(
    'enabled', true,
    'en', 'Free shipping on orders over $80 — Southeast Asia & worldwide',
    'vi', 'Miễn phí vận chuyển cho đơn hàng trên $80 — Đông Nam Á & toàn cầu'
  )
)
on conflict (key) do nothing;

-- ============================================
-- 9. Navigation links that point at routes which do not exist
-- ============================================
update public.navigation_menu_items set href = '/collections/new-arrivals'
  where href = '/new-arrivals';
update public.navigation_menu_items set href = '/collections/best-sellers'
  where href = '/best-sellers';
update public.navigation_menu_items set href = '/products?category=dresses'
  where href in ('/dresses', '/collections/dresses');
update public.navigation_menu_items set href = '/products?category=tops'
  where href in ('/tops', '/collections/tops');
update public.navigation_menu_items set href = '/products?category=bottoms'
  where href in ('/bottoms', '/collections/bottoms');
update public.navigation_menu_items set href = '/products?category=accessories'
  where href in ('/accessories', '/collections/accessories');
update public.navigation_menu_items set href = '/products?category=shirts'
  where href in ('/tops/shirts', '/collections/tops/shirts');
