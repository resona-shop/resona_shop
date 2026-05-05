"use client";

import Link from "next/link";
import { LocaleSwitch } from "@/components/layout/locale-switch";
import { SearchDialog } from "@/components/layout/search-dialog";
import { CartButton } from "@/components/cart/cart-button";
import { MobileNav } from "@/components/layout/mobile-nav";
import { BrandLogo } from "@/components/layout/brand-logo";
import type { NavigationMenuItem } from "@/lib/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export function HeaderClient({
  children,
  menuItems,
}: {
  children?: React.ReactNode;
  menuItems: NavigationMenuItem[];
}) {
  const childItems = menuItems.filter((item) => item.parent_id);
  const topLevelItems = menuItems.filter((item) => !item.parent_id);
  const getChildren = (item: NavigationMenuItem) =>
    childItems.filter((child) => child.parent_id === item.id || child.href.startsWith(`${item.href}/`));

  return (
    <header className="sticky top-0 z-50 border-y border-border/70 bg-background/95 backdrop-blur-xl">
      <div className="border-b border-border/70">
        <div className="mx-auto grid h-[70px] max-w-[1728px] grid-cols-[1fr_auto_1fr] items-center px-5 sm:px-8 lg:px-12">
          <div className="flex items-center justify-start">
            <MobileNav />
            <div className="lg:hidden">
              <SearchDialog />
            </div>
            <div className="hidden lg:block">
              <SearchDialog />
            </div>
          </div>

          <div className="flex items-center justify-center">
            <Link
              href="/"
              className="block"
              aria-label="Resona home"
            >
              <BrandLogo priority className="h-12 sm:h-14" />
            </Link>
          </div>

          <div className="flex items-center justify-end gap-1.5 text-foreground/80">
            <div className="hidden lg:block">
              <LocaleSwitch />
            </div>
            {children}
            <CartButton />
          </div>
        </div>
      </div>

      <div className="hidden lg:block">
        <div className="mx-auto max-w-[1728px] px-8 lg:px-12">
          <nav className="flex h-14 items-center justify-center gap-[clamp(1rem,2vw,2.25rem)]">
            {topLevelItems.map((item) => {
              const childrenForItem = getChildren(item);
              const hasChildren = childrenForItem.length > 0;

              if (!hasChildren) {
                return (
                  <Link
                    key={`${item.label}-${item.href}`}
                    href={item.href}
                    className="flex h-full items-center gap-1 whitespace-nowrap text-[13px] font-medium tracking-[0.01em] text-foreground/75 transition-colors hover:text-foreground"
                  >
                    <span>{item.label}</span>
                    {item.has_menu && (
                      <ChevronDown className="h-3.5 w-3.5 opacity-70" />
                    )}
                  </Link>
                );
              }

              return (
                <DropdownMenu key={`${item.label}-${item.href}`}>
                  <DropdownMenuTrigger className="group flex h-full items-center gap-1 whitespace-nowrap text-[13px] font-medium tracking-[0.01em] text-foreground/75 transition-colors hover:text-foreground">
                    <span>{item.label}</span>
                    <ChevronDown className="h-3.5 w-3.5 opacity-70 transition-transform group-hover:translate-y-0.5" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="min-w-44">
                    <DropdownMenuItem
                      render={
                        <Link href={item.href} className="w-full" />
                      }
                    >
                      {item.label}
                    </DropdownMenuItem>
                    {childrenForItem.map((child) => (
                      <DropdownMenuItem
                        key={`${child.label}-${child.href}`}
                        render={
                          <Link href={child.href} className="w-full" />
                        }
                      >
                        {child.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
