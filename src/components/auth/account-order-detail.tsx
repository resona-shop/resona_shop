"use client";

import { useState } from "react";
import Link from "next/link";
import { useShopT } from "@/lib/shop-i18n";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { requestRefund } from "@/actions/orders";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, MapPin } from "lucide-react";
import type { Order } from "@/types";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-indigo-100 text-indigo-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  refund_requested: "bg-orange-100 text-orange-800",
  refunded: "bg-gray-100 text-gray-800",
};

export function AccountOrderDetail({ order }: { order: Order }) {
  const t = useShopT();
  const router = useRouter();
  const [refunding, setRefunding] = useState(false);

  async function handleRefund() {
    if (!confirm(t("account.refundConfirm"))) return;
    setRefunding(true);
    const result = await requestRefund(order.id);
    setRefunding(false);
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error || t("account.refundError"));
    }
  }

  const addr = order.shipping_address;

  return (
    <div>
      <Link
        href="/account/orders"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("account.backToOrders")}
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl font-medium">{order.order_number}</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {new Date(order.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <Badge variant="secondary" className={STATUS_COLORS[order.status] || ""}>
          {t(`status.${order.status}` as Parameters<typeof t>[0])}
        </Badge>
      </div>

      <div className="space-y-4">
        {/* Items */}
        <div className="bg-card rounded-xl shadow-warm-sm p-5">
          <h3 className="font-medium mb-3">{t("account.orderItems")}</h3>
          <div className="divide-y divide-border">
            {order.items?.map((item) => (
              <div key={item.id} className="flex justify-between py-3 text-sm">
                <div>
                  <p className="font-medium">{item.product_name}</p>
                  {item.variant_label && (
                    <p className="text-xs text-muted-foreground">{item.variant_label}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    ${item.unit_price.toFixed(2)} &times; {item.quantity}
                  </p>
                </div>
                <p className="font-medium">${item.total.toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-border pt-3 mt-1 space-y-1.5 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>{t("account.subtotal")}</span>
              <span>${order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>{t("account.shipping")}</span>
              <span>${order.shipping_cost.toFixed(2)}</span>
            </div>
            {order.tax > 0 && (
              <div className="flex justify-between text-muted-foreground">
                <span>{t("account.tax")}</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between font-medium text-base pt-1.5 border-t border-border">
              <span>{t("cart.total")}</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        {addr?.line1 && (
          <div className="bg-card rounded-xl shadow-warm-sm p-5">
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              {t("account.shippingAddress")}
            </h3>
            <div className="text-sm text-muted-foreground space-y-0.5">
              {addr.full_name && <p className="text-foreground font-medium">{addr.full_name}</p>}
              <p>{addr.line1}</p>
              {addr.line2 && <p>{addr.line2}</p>}
              <p>
                {addr.city}
                {addr.state && `, ${addr.state}`} {addr.postal_code}
              </p>
              {addr.country && <p>{addr.country}</p>}
            </div>
          </div>
        )}

        {/* Refund */}
        {["confirmed", "processing"].includes(order.status) && (
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              disabled={refunding}
              onClick={handleRefund}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              {refunding ? (
                <>
                  <Loader2 className="mr-1.5 h-3 w-3 animate-spin" />
                  {t("account.refunding")}
                </>
              ) : (
                t("account.requestRefund")
              )}
            </Button>
          </div>
        )}
        {order.status === "refund_requested" && (
          <div className="rounded-lg border border-orange-200 bg-orange-50 px-4 py-3 text-sm text-orange-800">
            {t("account.refundPending")}
          </div>
        )}
      </div>
    </div>
  );
}
