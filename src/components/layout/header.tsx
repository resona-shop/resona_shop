import { UserMenu } from "@/components/auth/user-menu";
import { HeaderClient } from "@/components/layout/header-client";

export function Header() {
  return (
    <HeaderClient>
      <UserMenu />
    </HeaderClient>
  );
}
