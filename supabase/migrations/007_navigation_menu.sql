-- Editable storefront navigation menu

create table if not exists public.navigation_menu_items (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  href text not null,
  has_menu boolean not null default false,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_navigation_menu_items_sort
  on public.navigation_menu_items(sort_order);

create trigger update_navigation_menu_items_updated_at
  before update on public.navigation_menu_items
  for each row execute function public.update_updated_at();

alter table public.navigation_menu_items enable row level security;

create policy "Public read active navigation menu items"
  on public.navigation_menu_items
  for select using (is_active = true);

create policy "Admin manage navigation menu items"
  on public.navigation_menu_items
  for all using (public.is_admin());

insert into public.navigation_menu_items (label, href, has_menu, is_active, sort_order)
values
  ('New Arrivals', '/collections/new-arrivals', false, true, 0),
  ('Best Sellers', '/collections/best-sellers', false, true, 1),
  ('Dresses', '/collections/dresses', true, true, 2),
  ('Tops', '/collections/tops', true, true, 3),
  ('Bottoms', '/collections/bottoms', true, true, 4),
  ('Featured', '/products', true, true, 5),
  ('Collections', '/collections', true, true, 6),
  ('Accs', '/collections/accessories', true, true, 7),
  ('About Us', '/about', false, true, 8),
  ('Help', '/faq', false, true, 9)
on conflict do nothing;
