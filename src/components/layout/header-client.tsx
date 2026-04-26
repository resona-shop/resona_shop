"use client";

import Link from "next/link";
import { useShopT } from "@/lib/shop-i18n";
import { LocaleSwitch } from "@/components/layout/locale-switch";
import { SearchDialog } from "@/components/layout/search-dialog";
import { CartButton } from "@/components/cart/cart-button";
import { MobileNav } from "@/components/layout/mobile-nav";

const navKeys = [
  { key: "nav.newArrivals" as const, href: "/collections/new-arrivals" },
  { key: "nav.shopAll" as const, href: "/products" },
  { key: "nav.collections" as const, href: "/collections" },
  { key: "nav.about" as const, href: "/about" },
];

export function HeaderClient({ children }: { children?: React.ReactNode }) {
  const t = useShopT();

  return (
    <header className="sticky top-0 z-50 glass-warm border-b border-border/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <MobileNav />
            <Link
              href="/"
              className="font-[family-name:var(--font-playfair)] text-xl sm:text-2xl tracking-wide text-gradient-golden shrink-0"
            >
              Resona
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-8">
            {navKeys.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all hover:after:w-full"
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <LocaleSwitch />
            <SearchDialog />
            <CartButton />
            {children}
          </div>
        </div>
      </div>
    </header>
  );
}
