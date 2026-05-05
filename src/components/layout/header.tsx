import { UserMenu } from "@/components/auth/user-menu";
import { HeaderClient } from "@/components/layout/header-client";
import { getNavigationMenuItems } from "@/lib/navigation-menu";

export async function Header() {
  const menuItems = await getNavigationMenuItems();

  return (
    <HeaderClient menuItems={menuItems}>
      <UserMenu />
    </HeaderClient>
  );
}
