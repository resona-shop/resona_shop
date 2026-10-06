import { signOut } from "@/actions/auth";
import { getCurrentProfile, getCurrentUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import Link from "next/link";
import { UserMenuClient } from "./user-menu-client";

export async function UserMenu() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <Link href="/login" aria-label="Sign in">
        <Button variant="ghost" size="icon" className="text-foreground/70 hover:text-foreground">
          <User className="h-5 w-5" />
        </Button>
      </Link>
    );
  }

  const profile = await getCurrentProfile();
  const fullName =
    profile?.full_name || (user.user_metadata?.full_name as string) || "User";
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
      isAdmin={profile?.role === "admin"}
      signOutAction={signOut}
    />
  );
}
