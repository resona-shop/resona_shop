"use client";

import { useState } from "react";
import { useShopT } from "@/lib/shop-i18n";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { requestRefund } from "@/actions/orders";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

interface Order {
  id: string;
  order_number: string;
  created_at: string;
  status: string;
  total: number;
  items?: Array<{
    id: string;
    product_name: string;
    variant_label?: string | null;
    quantity: number;
    total: number;
  }>;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-indigo-100 text-indigo-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  refunded: "bg-gray-100 text-gray-800",
};

export function AccountOrdersContent({ orders }: { orders: Order[] }) {
  const t = useShopT();
  const router = useRouter();
  const [refundingId, setRefundingId] = useState<string | null>(null);

  async function handleRefund(orderId: string) {
    if (!confirm(t("account.refundConfirm"))) return;
    setRefundingId(orderId);
    const result = await requestRefund(orderId);
    setRefundingId(null);
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error || t("account.refundError"));
    }
  }

  return (
    <div>
      <h2 className="text-xl font-medium mb-6">{t("account.orderHistory")}</h2>

      {orders.length === 0 ? (
        <p className="text-muted-foreground text-center py-12 bg-card rounded-xl">
          {t("account.noOrdersYet")}
        </p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-card rounded-xl shadow-warm-sm p-5">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-medium">{order.order_number}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant="secondary" className={STATUS_COLORS[order.status] || ""}>
                  {order.status}
                </Badge>
              </div>

              {order.items && order.items.length > 0 && (
                <div className="border-t border-border pt-3 space-y-2">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.product_name}
                        {item.variant_label && ` (${item.variant_label})`}
                        {" × "}{item.quantity}
                      </span>
                      <span>${item.total.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-border pt-3 mt-3 flex justify-between items-center font-medium">
                <span>{t("cart.total")}</span>
                <span>${order.total.toFixed(2)}</span>
              </div>

              {["confirmed", "processing"].includes(order.status) && (
                <div className="mt-3 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={refundingId === order.id}
                    onClick={() => handleRefund(order.id)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    {refundingId === order.id ? (
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
