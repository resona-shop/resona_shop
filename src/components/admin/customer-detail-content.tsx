"use client";

import { useT, useAdminLocale, getStatusLabel } from "@/lib/admin-i18n";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, Calendar } from "lucide-react";
import { formatDate } from "@/lib/utils";

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

interface Profile {
  id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  created_at: string;
}

interface Order {
  id: string;
  order_number: string;
  created_at: string;
  status: string;
  total: number;
  items?: Array<{ id: string }>;
}

export function CustomerDetailContent({
  profile,
  orders,
}: {
  profile: Profile;
  orders: Order[];
}) {
  const t = useT();
  const locale = useAdminLocale((s) => s.locale);

  const totalSpent = orders.reduce((sum, o) => sum + Number(o.total), 0);

  return (
    <div className="max-w-3xl space-y-6">
      <Link
        href="/admin/customers"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("customers.backToList")}
      </Link>

      {/* Customer info */}
      <div className="bg-card rounded-xl shadow-warm-sm p-6">
        <h1 className="text-2xl font-semibold mb-4">
          {profile.full_name || profile.email}
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Mail className="h-4 w-4" />
            {profile.email}
          </div>
          {profile.phone && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4" />
              {profile.phone}
            </div>
          )}
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            {formatDate(profile.created_at)}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="bg-muted/30 rounded-lg p-4 text-center">
            <p className="text-2xl font-semibold">{orders.length}</p>
            <p className="text-xs text-muted-foreground">{t("customers.totalOrders")}</p>
          </div>
          <div className="bg-muted/30 rounded-lg p-4 text-center">
            <p className="text-2xl font-semibold">${totalSpent.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground">{t("customers.totalSpent")}</p>
          </div>
        </div>
      </div>

      {/* Order history */}
      <div>
        <h2 className="text-lg font-medium mb-4">{t("customers.orderHistory")}</h2>
        <div className="bg-card rounded-xl shadow-warm-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-4 py-3 font-medium text-muted-foreground">{t("table.order")}</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">{t("table.date")}</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">{t("table.status")}</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">{t("table.items")}</th>
                <th className="px-4 py-3 font-medium text-muted-foreground text-right">{t("table.total")}</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-border/50">
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${order.id}`} className="font-medium text-primary hover:underline">
                      {order.order_number}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(order.created_at, locale === "zh" ? "zh-CN" : "en-US")}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary" className={STATUS_COLORS[order.status] || ""}>
                      {getStatusLabel(order.status, locale)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{order.items?.length || 0}</td>
                  <td className="px-4 py-3 text-right font-medium">${Number(order.total).toFixed(2)}</td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    {t("customers.noOrders")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
