"use client";

import { useShopT } from "@/lib/shop-i18n";
import { User, Package, MapPin, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface UserMenuClientProps {
  fullName: string;
  email: string;
  initials: string;
  signOutAction: () => Promise<void>;
}

export function UserMenuClient({ fullName, email, initials, signOutAction }: UserMenuClientProps) {
  const t = useShopT();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="rounded-full outline-none">
        <Avatar className="h-8 w-8 border border-border">
          <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
            {initials}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium truncate">{fullName}</p>
          <p className="text-xs text-muted-foreground truncate">{email}</p>
        </div>
        <DropdownMenuSeparator />
        <Link href="/account" className="flex items-center gap-1.5 rounded-md px-1.5 py-1 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer">
          <User className="h-4 w-4" />
          {t("user.account")}
        </Link>
        <Link href="/account/orders" className="flex items-center gap-1.5 rounded-md px-1.5 py-1 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer">
          <Package className="h-4 w-4" />
          {t("user.orders")}
        </Link>
        <Link href="/account/addresses" className="flex items-center gap-1.5 rounded-md px-1.5 py-1 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer">
          <MapPin className="h-4 w-4" />
          {t("user.addresses")}
        </Link>
        <Link href="/account/settings" className="flex items-center gap-1.5 rounded-md px-1.5 py-1 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer">
          <Settings className="h-4 w-4" />
          {t("user.settings")}
        </Link>
        <DropdownMenuSeparator />
        <form action={signOutAction}>
          <button type="submit" className="flex items-center gap-1.5 rounded-md px-1.5 py-1 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer w-full">
            <LogOut className="h-4 w-4" />
            {t("user.signOut")}
          </button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
