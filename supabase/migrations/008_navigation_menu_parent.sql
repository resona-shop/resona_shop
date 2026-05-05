-- Add parent-child support for storefront navigation menu items

alter table public.navigation_menu_items
  add column if not exists parent_id uuid references public.navigation_menu_items(id) on delete set null;

create index if not exists idx_navigation_menu_items_parent
  on public.navigation_menu_items(parent_id);

-- Best-effort nesting for existing child URLs such as /collections/tops/shirts.
update public.navigation_menu_items child
set parent_id = parent.id
from public.navigation_menu_items parent
where child.parent_id is null
  and parent.href in (
    '/collections/dresses',
    '/collections/tops',
    '/collections/bottoms',
    '/collections/accessories'
  )
  and child.href like parent.href || '/%';
