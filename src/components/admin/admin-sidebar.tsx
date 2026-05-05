"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/admin-i18n";
import { BrandLogo } from "@/components/layout/brand-logo";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Layers,
  Settings,
  FolderTree,
  Warehouse,
} from "lucide-react";

const navItems = [
  { key: "nav.dashboard" as const, href: "/admin", icon: LayoutDashboard },
  { key: "nav.products" as const, href: "/admin/products", icon: Package },
  { key: "nav.categories" as const, href: "/admin/categories", icon: FolderTree },
  { key: "nav.inventory" as const, href: "/admin/inventory", icon: Warehouse },
  { key: "nav.orders" as const, href: "/admin/orders", icon: ShoppingBag },
  { key: "nav.customers" as const, href: "/admin/customers", icon: Users },
  { key: "nav.collections" as const, href: "/admin/collections", icon: Layers },
  { key: "nav.settings" as const, href: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const t = useT();

  return (
    <aside className="w-60 shrink-0 border-r border-border bg-sidebar min-h-[calc(100vh-4rem)]">
      <div className="p-4">
        <Link
          href="/admin"
          className="flex items-center gap-2"
          aria-label="Resona Admin"
        >
          <BrandLogo className="h-7" />
          <span className="text-xs font-semibold uppercase tracking-wide text-sidebar-foreground/60">
            Admin
          </span>
        </Link>
      </div>
      <nav className="px-2 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-primary font-medium"
                  : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {t(item.key)}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
