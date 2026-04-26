"use client";

import { useCart } from "@/hooks/use-cart";
import { CartItem } from "@/components/cart/cart-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useShopT } from "@/lib/shop-i18n";

export default function CartPage() {
  const items = useCart((s) => s.items);
  const [mounted, setMounted] = useState(false);
  const t = useShopT();
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl tracking-tight mb-8">
          {t("cart.title")}
        </h1>
        <div className="animate-pulse space-y-4">
          {[1, 2].map((i) => (
            <div key={i} className="h-24 bg-secondary/50 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 lg:py-24 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground/40 mb-4" />
        <h1 className="font-[family-name:var(--font-playfair)] text-2xl mb-2">
          {t("cart.empty")}
        </h1>
        <p className="text-muted-foreground mb-6">{t("cart.emptySubtitle")}</p>
        <Link href="/products">
          <Button className="bg-gradient-golden text-white hover:opacity-90 px-8">
            {t("cart.startShopping")}
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <h1 className="font-[family-name:var(--font-playfair)] text-3xl tracking-tight mb-8">
        {t("cart.title")}
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-2">
          <div className="divide-y divide-border">
            {items.map((item) => (
              <CartItem key={item.variant_id} item={item} />
            ))}
          </div>
        </div>
        <CartSummary />
      </div>
    </div>
  );
}
