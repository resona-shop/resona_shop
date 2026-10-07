import { HeaderClient } from "@/components/layout/header-client";
import { getPublicNavigationMenuItems } from "@/lib/navigation-menu";

export async function Header() {
  const menuItems = await getPublicNavigationMenuItems();

  return <HeaderClient menuItems={menuItems} />;
}