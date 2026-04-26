"use client";

import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useShopT } from "@/lib/shop-i18n";

export function CartSummary() {
  const { subtotal, totalItems } = useCart();
  const t = useShopT();

  const sub = subtotal();
  const shipping = sub >= 80 ? 0 : 9.99;
  const total = sub + shipping;

  return (
    <div className="bg-card rounded-2xl shadow-warm p-6 space-y-4 sticky top-24">
      <h2 className="font-medium text-lg">{t("cart.orderSummary")}</h2>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">
            {t("cart.subtotal")} ({totalItems()} {t("cart.items")})
          </span>
          <span>{formatPrice(sub)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">{t("cart.shipping")}</span>
          <span>
            {shipping === 0 ? (
              <span className="text-emerald-soft font-medium">{t("cart.free")}</span>
            ) : (
              formatPrice(shipping)
            )}
          </span>
        </div>
        {shipping > 0 && (
          <p className="text-xs text-muted-foreground">{t("cart.freeShippingNote")}</p>
        )}
      </div>

      <div className="border-t border-border pt-4 flex justify-between font-medium">
        <span>{t("cart.total")}</span>
        <span className="text-lg">{formatPrice(total)}</span>
      </div>

      <Link href="/checkout" className="block">
        <Button className="w-full h-12 bg-gradient-golden text-white shadow-glow-coral hover:opacity-90 text-base">
          {t("cart.checkout")}
        </Button>
      </Link>

      <Link
        href="/products"
        className="block text-center text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        {t("cart.continueShopping")}
      </Link>
    </div>
  );
}
