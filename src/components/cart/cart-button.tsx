"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useEffect, useState } from "react";

export function CartButton() {
  const totalItems = useCart((s) => s.totalItems);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const count = mounted ? totalItems() : 0;

  return (
    <Link
      href="/cart"
      className="relative p-2 text-foreground/70 hover:text-foreground transition-colors"
    >
      <ShoppingBag className="h-5 w-5" />
      {count > 0 && (
        <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold px-1 animate-scale-in">
          {count}
        </span>
      )}
      <span className="sr-only">Cart ({count} items)</span>
    </Link>
  );
}
