"use client";

import { useT, useAdminLocale, getStatusLabel } from "@/lib/admin-i18n";
import { StatsCard } from "@/components/admin/stats-card";
import { Package, ShoppingBag, Users, DollarSign, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { OrderStatus } from "@/types";
import Link from "next/link";

interface DashboardContentProps {
  stats: {
    totalRevenue: number;
    orderCount: number;
    productCount: number;
    customerCount: number;
    lowStockCount: number;
    recentOrders: Array<{
      id: string;
      order_number: string;
      created_at: string;
      status: string;
      total: number;
    }>;
  };
}

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

export function DashboardContent({ stats }: DashboardContentProps) {
  const t = useT();
  const locale = useAdminLocale((s) => s.locale);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">{t("dashboard.title")}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard
          title={t("dashboard.totalRevenue")}
          value={`$${stats.totalRevenue.toFixed(2)}`}
          icon={DollarSign}
        />
        <StatsCard
          title={t("dashboard.orders")}
          value={stats.orderCount}
          icon={ShoppingBag}
        />
        <StatsCard
          title={t("dashboard.products")}
          value={stats.productCount}
          icon={Package}
        />
        <StatsCard
          title={t("dashboard.customers")}
          value={stats.customerCount}
          icon={Users}
        />
        <Link href="/admin/inventory">
          <StatsCard
            title={t("dashboard.lowStock")}
            value={stats.lowStockCount}
            icon={AlertTriangle}
            className={stats.lowStockCount > 0 ? "border-2 border-amber-300 bg-amber-50/50" : ""}
            description={stats.lowStockCount > 0 ? (locale === "zh" ? "点击查看详情" : "Click to view") : undefined}
          />
        </Link>
      </div>

      <div>
        <h2 className="text-lg font-medium mb-4">{t("dashboard.recentOrders")}</h2>
        <div className="bg-card rounded-xl shadow-warm-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-4 py-3 font-medium text-muted-foreground">{t("table.order")}</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">{t("table.date")}</th>
                <th className="px-4 py-3 font-medium text-muted-foreground">{t("table.status")}</th>
                <th className="px-4 py-3 font-medium text-muted-foreground text-right">{t("table.total")}</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-border/50">
                  <td className="px-4 py-3 font-medium">{order.order_number}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {formatDate(order.created_at, locale === "zh" ? "zh-CN" : "en-US")}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary" className={STATUS_COLORS[order.status] || ""}>
                      {getStatusLabel(order.status, locale)}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">${Number(order.total).toFixed(2)}</td>
                </tr>
              ))}
              {stats.recentOrders.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                    {t("dashboard.noOrders")}
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
