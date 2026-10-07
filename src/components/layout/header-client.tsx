"use client";

import Link from "next/link";
import { SearchDialog } from "@/components/layout/search-dialog";
import { CartButton } from "@/components/cart/cart-button";
import { MobileNav } from "@/components/layout/mobile-nav";
import { BrandLogo } from "@/components/layout/brand-logo";
import { UserMenuClient } from "@/components/auth/user-menu-client";
import { useAuthState } from "@/hooks/use-auth-state";
import { Button } from "@/components/ui/button";
import { ChevronDown, User } from "lucide-react";
import type { NavigationMenuItem } from "@/lib/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function HeaderClient({
  menuItems,
}: {
  menuItems: NavigationMenuItem[];
}) {
  const { user } = useAuthState();

  const childItems = menuItems.filter((item) => item.parent_id);
  const topLevelItems = menuItems.filter((item) => !item.parent_id);
  const getChildren = (item: NavigationMenuItem) =>
    childItems.filter((child) => child.parent_id === item.id);

  return (
    <header className="sticky top-0 z-50 border-y border-border/70 bg-background/95 backdrop-blur-xl">
      <div className="border-b border-border/70">
        <div className="mx-auto grid h-[70px] max-w-[1728px] grid-cols-[1fr_auto_1fr] items-center px-5 sm:px-8 lg:px-12">
          <div className="flex items-center justify-start">
            <MobileNav menuItems={menuItems} isSignedIn={!!user} />
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
            {user ? (
              <UserMenuClient
                fullName={user.fullName}
                email={user.email}
                initials={user.initials}
                isAdmin={user.isAdmin}
              />
            ) : (
              <Link href="/login" aria-label="Sign in">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-foreground/70 hover:text-foreground"
                >
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}
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