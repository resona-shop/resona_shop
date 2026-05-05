import { createClient } from "@/lib/supabase/server";

export interface NavigationMenuItem {
  id?: string;
  label: string;
  href: string;
  has_menu: boolean;
  is_active: boolean;
  sort_order: number;
  parent_id?: string | null;
}

export const defaultNavigationMenuItems: NavigationMenuItem[] = [
  { label: "New Arrivals", href: "/collections/new-arrivals", has_menu: false, is_active: true, sort_order: 0 },
  { label: "Best Sellers", href: "/collections/best-sellers", has_menu: false, is_active: true, sort_order: 1 },
  { label: "Dresses", href: "/collections/dresses", has_menu: true, is_active: true, sort_order: 2 },
  { label: "Tops", href: "/collections/tops", has_menu: true, is_active: true, sort_order: 3 },
  { label: "Bottoms", href: "/collections/bottoms", has_menu: true, is_active: true, sort_order: 4 },
  { label: "Featured", href: "/products", has_menu: true, is_active: true, sort_order: 5 },
  { label: "Collections", href: "/collections", has_menu: true, is_active: true, sort_order: 6 },
  { label: "Accs", href: "/collections/accessories", has_menu: true, is_active: true, sort_order: 7 },
  { label: "About Us", href: "/about", has_menu: false, is_active: true, sort_order: 8 },
  { label: "Help", href: "/faq", has_menu: false, is_active: true, sort_order: 9 },
];

export async function getNavigationMenuItems(options?: {
  includeInactive?: boolean;
}) {
  const supabase = await createClient();
  const query = supabase
    .from("navigation_menu_items")
    .select("id, label, href, has_menu, is_active, sort_order, parent_id")
    .order("sort_order", { ascending: true });

  const { data, error } = options?.includeInactive
    ? await query
    : await query.eq("is_active", true);

  if (error || !data || data.length === 0) {
    return defaultNavigationMenuItems;
  }

  const items = data as NavigationMenuItem[];
  return items.map((item) => {
    if (item.parent_id) return item;
    const inferredParent = items.find((candidate) =>
      candidate.id &&
      candidate.id !== item.id &&
      !candidate.parent_id &&
      item.href.startsWith(`${candidate.href}/`)
    );
    return inferredParent ? { ...item, parent_id: inferredParent.id } : item;
  });
}
