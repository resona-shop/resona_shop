"use client";

import { useT } from "@/lib/admin-i18n";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface Product {
  id: string;
  name: string;
  slug: string;
  base_price: number;
  compare_at_price: number | null;
  is_active: boolean;
  is_featured: boolean;
  category?: { name: string } | null;
  variants?: Array<{ id: string }>;
}

export function ProductsContent({
  products,
  searchQuery,
  page = 1,
  totalPages = 1,
  onDelete,
}: {
  products: Product[];
  searchQuery?: string;
  page?: number;
  totalPages?: number;
  onDelete: (id: string) => Promise<{ error?: string; archived?: boolean; success?: boolean }>;
}) {
  const t = useT();
  const router = useRouter();

  async function handleDelete(id: string) {
    if (!confirm(t("products.deleteConfirm"))) return;
    const result = await onDelete(id);
    if (result.error) toast.error(result.error);
    else if (result.archived) toast.info(t("products.archived"));
    router.refresh();
  }

  function pageHref(target: number) {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (target > 1) params.set("page", String(target));
    const qs = params.toString();
    return `/admin/products${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t("products.title")}</h1>
        <Link href="/admin/products/new">
          <Button className="bg-gradient-golden text-white hover:opacity-90">
            <Plus className="mr-2 h-4 w-4" />
            {t("products.add")}
          </Button>
        </Link>
      </div>

      <form className="max-w-sm">
        <input
          name="q"
          type="search"
          placeholder={t("products.search")}
          defaultValue={searchQuery || ""}
          className="w-full h-9 rounded-lg border border-input bg-background px-3 text-sm"
        />
      </form>

      <div className="bg-card rounded-xl shadow-warm-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-4 py-3 font-medium text-muted-foreground">{t("table.product")}</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">{t("table.category")}</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">{t("table.price")}</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">{t("table.variants")}</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">{t("table.status")}</th>
              <th className="px-4 py-3 font-medium text-muted-foreground text-right">{t("table.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b border-border/50">
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.slug}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{product.category?.name || "—"}</td>
                <td className="px-4 py-3">
                  ${Number(product.base_price).toFixed(2)}
                  {product.compare_at_price && (
                    <span className="text-xs text-muted-foreground line-through ml-1">
                      ${Number(product.compare_at_price).toFixed(2)}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{product.variants?.length || 0}</td>
                <td className="px-4 py-3">
                  <Badge
                    variant="secondary"
                    className={product.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
                  >
                    {product.is_active ? t("products.active") : t("products.draft")}
                  </Badge>
                  {product.is_featured && (
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800 ml-1">
                      {t("products.featured")}
                    </Badge>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/products/${product.id}/edit`} className="text-xs text-primary hover:underline">
                      {t("products.edit")}
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-xs text-destructive hover:underline"
                    >
                      {t("products.delete")}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  {t("products.noProducts")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <p className="text-muted-foreground">
            {t("orders.page")} {page} {t("orders.of")} {totalPages}
          </p>
          <div className="flex items-center gap-2">
            {page > 1 && (
              <Link href={pageHref(page - 1)} className="px-3 py-1.5 rounded-lg border border-input bg-background hover:bg-muted/50 transition-colors">
                {t("orders.prev")}
              </Link>
            )}
            {page < totalPages && (
              <Link href={pageHref(page + 1)} className="px-3 py-1.5 rounded-lg border border-input bg-background hover:bg-muted/50 transition-colors">
                {t("orders.next")}
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
