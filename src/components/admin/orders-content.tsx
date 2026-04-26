"use client";

import { useT, useAdminLocale, getStatusLabel } from "@/lib/admin-i18n";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Search, ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-indigo-100 text-indigo-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  refunded: "bg-gray-100 text-gray-800",
};

interface Order {
  id: string;
  order_number: string;
  created_at: string;
  status: string;
  total: number;
  items?: Array<{ id: string }>;
  user?: { full_name?: string; email?: string } | null;
}

export function OrdersContent({
  orders,
  total,
  page,
  totalPages,
  currentStatus,
  currentSort,
  searchQuery,
}: {
  orders: Order[];
  total: number;
  page: number;
  totalPages: number;
  currentStatus: string;
  currentSort: string;
  searchQuery?: string;
}) {
  const t = useT();
  const locale = useAdminLocale((s) => s.locale);
  const router = useRouter();
  const [search, setSearch] = useState(searchQuery || "");

  const statuses = [
    "all", "pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refunded",
  ];

  function buildUrl(overrides: Record<string, string | number | undefined>) {
    const params = new URLSearchParams();
    const vals = {
      status: currentStatus,
      sort: currentSort,
      q: searchQuery || "",
      page: String(page),
      ...overrides,
    };
    if (vals.status && vals.status !== "all") params.set("status", String(vals.status));
    if (vals.sort && vals.sort !== "date-desc") params.set("sort", String(vals.sort));
    if (vals.q) params.set("q", String(vals.q));
    if (Number(vals.page) > 1) params.set("page", String(vals.page));
    const qs = params.toString();
    return `/admin/orders${qs ? `?${qs}` : ""}`;
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(buildUrl({ q: search, page: 1 }));
  }

  function handleSort(sort: string) {
    router.push(buildUrl({ sort, page: 1 }));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t("orders.title")}</h1>
        <span className="text-sm text-muted-foreground">
          {total} {t("orders.results")}
        </span>
      </div>

      {/* Search + Sort row */}
      <div className="flex flex-wrap items-center gap-3">
        <form onSubmit={handleSearch} className="flex-1 max-w-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("orders.search")}
              className="w-full h-9 rounded-lg border border-input bg-background pl-9 pr-3 text-sm"
            />
          </div>
        </form>

        <div className="flex items-center gap-1.5">
          <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
          <select
            value={currentSort}
            onChange={(e) => handleSort(e.target.value)}
            className="h-9 rounded-lg border border-input bg-background px-3 text-sm cursor-pointer"
          >
            <option value="date-desc">{t("orders.sortNewest")}</option>
            <option value="date-asc">{t("orders.sortOldest")}</option>
            <option value="total-desc">{t("orders.sortTotalDesc")}</option>
            <option value="total-asc">{t("orders.sortTotalAsc")}</option>
          </select>
        </div>
      </div>

      {/* Status filter */}
      <div className="flex flex-wrap gap-2">
        {statuses.map((s) => (
          <a
            key={s}
            href={buildUrl({ status: s, page: 1 })}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              currentStatus === s
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {s === "all" ? t("orders.all") : getStatusLabel(s, locale)}
          </a>
        ))}
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl shadow-warm-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-4 py-3 font-medium text-muted-foreground">{t("table.order")}</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">{t("table.customer")}</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">{t("table.date")}</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">{t("table.status")}</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">{t("table.items")}</th>
              <th className="px-4 py-3 font-medium text-muted-foreground text-right">{t("table.total")}</th>
              <th className="px-4 py-3 font-medium text-muted-foreground text-right">{t("table.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="px-4 py-3">
                  <Link href={`/admin/orders/${order.id}`} className="font-medium text-primary hover:underline">
                    {order.order_number}
                  </Link>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {order.user?.full_name || order.user?.email || t("orders.guest")}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {new Date(order.created_at).toLocaleDateString(locale === "zh" ? "zh-CN" : "en-US")}
                </td>
                <td className="px-4 py-3">
                  <Badge variant="secondary" className={STATUS_COLORS[order.status] || ""}>
                    {getStatusLabel(order.status, locale)}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{order.items?.length || 0}</td>
                <td className="px-4 py-3 text-right font-medium">${Number(order.total).toFixed(2)}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-xs text-primary hover:underline"
                  >
                    {t("orders.viewDetail")} →
                  </Link>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">
                  {t("orders.noOrders")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {t("orders.page")} {page} {t("orders.of")} {totalPages}
          </p>
          <div className="flex items-center gap-2">
            {page > 1 ? (
              <a
                href={buildUrl({ page: page - 1 })}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-input bg-background text-sm hover:bg-muted/50 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                {t("orders.prev")}
              </a>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-input bg-background text-sm opacity-50 cursor-not-allowed">
                <ChevronLeft className="h-4 w-4" />
                {t("orders.prev")}
              </span>
            )}

            {page < totalPages ? (
              <a
                href={buildUrl({ page: page + 1 })}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-input bg-background text-sm hover:bg-muted/50 transition-colors"
              >
                {t("orders.next")}
                <ChevronRight className="h-4 w-4" />
              </a>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-input bg-background text-sm opacity-50 cursor-not-allowed">
                {t("orders.next")}
                <ChevronRight className="h-4 w-4" />
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
