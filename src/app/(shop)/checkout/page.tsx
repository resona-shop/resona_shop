"use client";

import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useShopT } from "@/lib/shop-i18n";

export default function CheckoutPage() {
  const { items, subtotal } = useCart();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const t = useShopT();

  useEffect(() => setMounted(true), []);

  async function handleCheckout() {
    setLoading(true);
    const checkoutItems = items.map((item) => {
      const primaryImage =
        item.product.images?.find((img) => img.is_primary) ||
        item.product.images?.[0];
      return {
        product_id: item.product_id,
        variant_id: item.variant_id,
        name: item.product.name,
        price: item.variant.price_override ?? item.product.base_price,
        quantity: item.quantity,
        image: primaryImage?.url,
        variant_label: `${item.variant.color} / ${item.variant.size}`,
      };
    });

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: checkoutItems }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setLoading(false);
      }
    } catch {
      setLoading(false);
    }
  }

  if (!mounted) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="animate-pulse h-8 bg-secondary/50 rounded w-48 mx-auto" />
      </div>
    );
  }

  if (items.length === 0) {
    router.push("/cart");
    return null;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <h1 className="font-[family-name:var(--font-playfair)] text-3xl tracking-tight mb-8">
        {t("checkout.title")}
      </h1>

      <div className="bg-card rounded-2xl shadow-warm p-6 space-y-4">
        <h2 className="font-medium">{t("checkout.review")}</h2>

        <div className="divide-y divide-border">
          {items.map((item) => (
            <div key={item.variant_id} className="flex justify-between py-3 text-sm">
              <div>
                <p className="font-medium">{item.product.name}</p>
                <p className="text-muted-foreground text-xs">
                  {item.variant.color} / {item.variant.size} &times; {item.quantity}
                </p>
              </div>
              <p className="font-medium">
                ${((item.variant.price_override ?? item.product.base_price) * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        <div className="border-t border-border pt-4 flex justify-between font-medium text-lg">
          <span>{t("checkout.subtotal")}</span>
          <span>${subtotal().toFixed(2)}</span>
        </div>

        <p className="text-xs text-muted-foreground">{t("checkout.shippingNote")}</p>

        <Button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full h-12 bg-gradient-golden text-white shadow-glow-coral hover:opacity-90 text-base"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              {t("checkout.redirecting")}
            </>
          ) : (
            t("checkout.pay")
          )}
        </Button>
      </div>
    </div>
  );
}
