import { createClient, createPublicClient } from "@/lib/supabase/server";

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
  { label: "Dresses", href: "/products?category=dresses", has_menu: false, is_active: true, sort_order: 2 },
  { label: "Tops", href: "/products?category=tops", has_menu: false, is_active: true, sort_order: 3 },
  { label: "Bottoms", href: "/products?category=bottoms", has_menu: false, is_active: true, sort_order: 4 },
  { label: "Shop All", href: "/products", has_menu: false, is_active: true, sort_order: 5 },
  { label: "Collections", href: "/collections", has_menu: false, is_active: true, sort_order: 6 },
  { label: "About Us", href: "/about", has_menu: false, is_active: true, sort_order: 7 },
  { label: "Help", href: "/faq", has_menu: false, is_active: true, sort_order: 8 },
];

// Storefront pages that always exist, offered as link suggestions in the admin.
export const staticStorefrontLinks = [
  { label: "Home", href: "/" },
  { label: "Shop All", href: "/products" },
  { label: "Collections", href: "/collections" },
  { label: "About", href: "/about" },
  { label: "Our Story", href: "/story" },
  { label: "Sustainability", href: "/sustainability" },
  { label: "Careers", href: "/careers" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
  { label: "Shipping", href: "/shipping" },
  { label: "Size Guide", href: "/size-guide" },
];

// Storefront header menu. Reads without cookies so shop routes can prerender;
// the admin editor keeps the request-scoped client to also see inactive items.
export async function getPublicNavigationMenuItems() {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("navigation_menu_items")
    .select("id, label, href, has_menu, is_active, sort_order, parent_id")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error || !data || data.length === 0) {
    return defaultNavigationMenuItems;
  }

  return data as NavigationMenuItem[];
}

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

  return data as NavigationMenuItem[];
}
