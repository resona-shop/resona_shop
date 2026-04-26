"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { useShopT } from "@/lib/shop-i18n";

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const clearCart = useCart((s) => s.clearCart);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(true);
  const t = useShopT();

  useEffect(() => {
    if (!sessionId) {
      setConfirming(false);
      return;
    }
    clearCart();
    fetch("/api/stripe/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ session_id: sessionId }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.order?.order_number) setOrderNumber(data.order.order_number);
      })
      .finally(() => setConfirming(false));
  }, [sessionId, clearCart]);

  if (confirming) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 lg:py-24 text-center">
        <Loader2 className="h-10 w-10 mx-auto animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">{t("success.confirming")}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16 lg:py-24 text-center">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-soft/10 mb-6 animate-scale-in">
        <CheckCircle className="h-10 w-10 text-emerald-soft" />
      </div>
      <h1 className="font-[family-name:var(--font-playfair)] text-3xl mb-3">{t("success.title")}</h1>
      {orderNumber && (
        <p className="text-sm font-medium text-primary mb-2">{t("success.order")} {orderNumber}</p>
      )}
      <p className="text-muted-foreground mb-8 leading-relaxed">{t("success.message")}</p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/account/orders">
          <Button variant="outline" className="border-primary/30 hover:bg-primary/5">{t("success.viewOrders")}</Button>
        </Link>
        <Link href="/products">
          <Button className="bg-gradient-golden text-white hover:opacity-90">{t("success.continueShopping")}</Button>
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
