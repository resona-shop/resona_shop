"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useShopT } from "@/lib/shop-i18n";

const navKeys = [
  { key: "nav.newArrivals" as const, href: "/collections/new-arrivals" },
  { key: "nav.shopAll" as const, href: "/products" },
  { key: "nav.collections" as const, href: "/collections" },
  { key: "nav.about" as const, href: "/about" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const t = useShopT();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger className="lg:hidden p-2 -ml-2">
        <Menu className="h-5 w-5" />
        <span className="sr-only">Menu</span>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 bg-background p-0">
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <div className="flex flex-col h-full">
          <div className="p-6 border-b border-border">
            <Link href="/" onClick={() => setOpen(false)} className="font-[family-name:var(--font-playfair)] text-2xl tracking-wide text-gradient-golden">
              Resona
            </Link>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            {navKeys.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "bg-secondary text-primary"
                    : "text-foreground/70 hover:bg-secondary/50 hover:text-foreground"
                )}
              >
                {t(item.key)}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-border">
            <Link href="/login" onClick={() => setOpen(false)}>
              <Button className="w-full bg-gradient-golden text-white hover:opacity-90">
                {t("auth.signIn")}
              </Button>
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
