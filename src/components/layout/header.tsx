import { UserMenu } from "@/components/auth/user-menu";
import { HeaderClient } from "@/components/layout/header-client";
import { getNavigationMenuItems } from "@/lib/navigation-menu";
import { getCurrentUser } from "@/lib/auth";

export async function Header() {
  const [menuItems, user] = await Promise.all([
    getNavigationMenuItems(),
    getCurrentUser(),
  ]);

  return (
    <HeaderClient menuItems={menuItems} isSignedIn={!!user}>
      <UserMenu />
    </HeaderClient>
  );
}
