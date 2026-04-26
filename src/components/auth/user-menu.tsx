import { getUser } from "@/actions/auth";
import { signOut } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserMenuClient } from "./user-menu-client";

export async function UserMenu() {
  const user = await getUser();

  if (!user) {
    return (
      <Link href="/login">
        <Button variant="ghost" size="sm" className="text-foreground/80 hover:text-foreground">
          Sign In
        </Button>
      </Link>
    );
  }

  const fullName = (user.user_metadata?.full_name as string) || "User";
  const initials = fullName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase() || user.email?.[0].toUpperCase() || "U";

  return (
    <UserMenuClient
      fullName={fullName}
      email={user.email || ""}
      initials={initials}
      signOutAction={signOut}
    />
  );
}
