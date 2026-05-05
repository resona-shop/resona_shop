"use client";

import { useState } from "react";
import { useT } from "@/lib/admin-i18n";
import Link from "next/link";
import { Search, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";

interface Customer {
  id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  created_at: string;
  order_count: number;
  total_spent: number;
}

export function CustomersContent({
  customers,
  searchQuery,
}: {
  customers: Customer[];
  searchQuery?: string;
}) {
  const t = useT();
  const router = useRouter();
  const [search, setSearch] = useState(searchQuery || "");

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/admin/customers${search ? `?q=${search}` : ""}`);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{t("customers.title")}</h1>

      <form onSubmit={handleSearch} className="max-w-sm flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("customers.search")}
            className="w-full h-9 rounded-lg border border-input bg-background pl-9 pr-3 text-sm"
          />
        </div>
      </form>

      <div className="bg-card rounded-xl shadow-warm-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-4 py-3 font-medium text-muted-foreground">{t("table.name")}</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">{t("table.email")}</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">{t("customers.totalOrders")}</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">{t("customers.totalSpent")}</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">{t("table.joined")}</th>
              <th className="px-4 py-3 font-medium text-muted-foreground text-right">{t("table.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-b border-border/50">
                <td className="px-4 py-3 font-medium">{customer.full_name || "—"}</td>
                <td className="px-4 py-3 text-muted-foreground">{customer.email}</td>
                <td className="px-4 py-3">
                  <span className={customer.order_count > 0 ? "font-medium" : "text-muted-foreground"}>
                    {customer.order_count}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={customer.total_spent > 0 ? "font-medium" : "text-muted-foreground"}>
                    ${customer.total_spent.toFixed(2)}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatDate(customer.created_at)}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/customers/${customer.id}`}
                    className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                  >
                    <Eye className="h-3 w-3" />
                    {t("customers.viewOrders")}
                  </Link>
                </td>
              </tr>
            ))}
            {customers.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  {t("customers.noCustomers")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
