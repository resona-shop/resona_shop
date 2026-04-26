"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useEffect, useRef, useState } from "react";

export function CartButton() {
  const items = useCart((s) => s.items);
  const [mounted, setMounted] = useState(false);
  const badgeRef = useRef<HTMLSpanElement>(null);
  const prevCount = useRef(0);

  useEffect(() => setMounted(true), []);

  const count = mounted ? items.reduce((sum, item) => sum + item.quantity, 0) : 0;

  useEffect(() => {
    if (count > prevCount.current && badgeRef.current) {
      badgeRef.current.style.animation = "none";
      badgeRef.current.offsetHeight;
      badgeRef.current.style.animation = "";
    }
    prevCount.current = count;
  }, [count]);

  return (
    <Link
      href="/cart"
      className="relative p-2 text-foreground/70 hover:text-foreground transition-colors"
    >
      <ShoppingBag className="h-5 w-5" />
      {count > 0 && (
        <span
          ref={badgeRef}
          className="absolute -top-0.5 -right-0.5 h-4 min-w-4 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-[10px] font-bold px-1 animate-cart-bounce"
        >
          {count}
        </span>
      )}
      <span className="sr-only">Cart ({count} items)</span>
    </Link>
  );
}
