"use client";

import Link from "next/link";
import { User, Package, MapPin, Settings } from "lucide-react";
import { useShopT } from "@/lib/shop-i18n";

export function AccountNav() {
  const t = useShopT();

  const accountNav = [
    { label: t("account.overview"), href: "/account", icon: User },
    { label: t("account.orders"), href: "/account/orders", icon: Package },
    { label: t("account.addresses"), href: "/account/addresses", icon: MapPin },
    { label: t("account.settings"), href: "/account/settings", icon: Settings },
  ];

  return (
    <>
      <h1 className="font-[family-name:var(--font-playfair)] text-3xl tracking-tight mb-8">
        {t("account.title")}
      </h1>
      <nav className="space-y-1">
        {accountNav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-foreground/70 hover:bg-secondary/50 hover:text-foreground transition-colors"
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
