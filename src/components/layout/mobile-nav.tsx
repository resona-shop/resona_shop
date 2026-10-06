"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useShopT } from "@/lib/shop-i18n";
import { BrandLogo } from "@/components/layout/brand-logo";
import type { NavigationMenuItem } from "@/lib/navigation-menu";

export function MobileNav({
  menuItems,
  isSignedIn,
}: {
  menuItems: NavigationMenuItem[];
  isSignedIn: boolean;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const t = useShopT();

  const topLevelItems = menuItems.filter((item) => !item.parent_id);
  const getChildren = (item: NavigationMenuItem) =>
    menuItems.filter((child) => child.parent_id && child.parent_id === item.id);

  function renderLink(item: NavigationMenuItem, nested = false) {
    return (
      <Link
        key={`${item.label}-${item.href}`}
        href={item.href}
        onClick={() => setOpen(false)}
        className={cn(
          "flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
          nested && "ml-4 py-2 font-normal",
          pathname === item.href
            ? "bg-secondary text-primary"
            : "text-foreground/70 hover:bg-secondary/50 hover:text-foreground"
        )}
      >
        {item.label}
      </Link>
    );
  }

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
            <Link href="/" onClick={() => setOpen(false)} aria-label="Resona home">
              <BrandLogo className="h-10" />
            </Link>
          </div>
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {topLevelItems.map((item) => (
              <div key={`${item.label}-${item.href}`}>
                {renderLink(item)}
                {getChildren(item).map((child) => renderLink(child, true))}
              </div>
            ))}
          </nav>
          <div className="p-4 border-t border-border">
            <Link href={isSignedIn ? "/account" : "/login"} onClick={() => setOpen(false)}>
              <Button className="w-full bg-gradient-golden text-white hover:opacity-90">
                {isSignedIn ? t("user.account") : t("auth.signIn")}
              </Button>
            </Link>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
