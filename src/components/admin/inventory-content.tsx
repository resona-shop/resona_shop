"use client";

import { useMemo, useState } from "react";
import { useT } from "@/lib/admin-i18n";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Check, ChevronDown, ChevronRight, ChevronLeft, Loader2, Search } from "lucide-react";

interface InventoryItem {
  id: string;
  size: string;
  color: string;
  sku: string | null;
  stock_quantity: number;
  is_active: boolean;
  product: { name: string; slug: string } | null;
}

interface ProductGroup {
  name: string;
  slug: string;
  variants: InventoryItem[];
  totalStock: number;
  hasLowStock: boolean;
  hasOutOfStock: boolean;
}

export function InventoryContent({
  items,
  onUpdateStock,
}: {
  items: InventoryItem[];
  onUpdateStock: (variantId: string, quantity: number) => Promise<{ error?: string; success?: boolean }>;
}) {
  const t = useT();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [page, setPage] = useState(1);
  const perPage = 10;

  const groups = useMemo(() => {
    const map = new Map<string, ProductGroup>();
    for (const item of items) {
      const key = item.product?.slug || item.id;
      if (!map.has(key)) {
        map.set(key, {
          name: item.product?.name || "—",
          slug: key,
          variants: [],
          totalStock: 0,
          hasLowStock: false,
          hasOutOfStock: false,
        });
      }
      const group = map.get(key)!;
      group.variants.push(item);
      group.totalStock += item.stock_quantity;
      if (item.stock_quantity === 0) group.hasOutOfStock = true;
      else if (item.stock_quantity <= 5) group.hasLowStock = true;
    }
    return Array.from(map.values());
  }, [items]);

  const filtered = useMemo(() => {
    if (!search.trim()) return groups;
    const q = search.toLowerCase();
    return groups.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        g.variants.some(
          (v) =>
            v.size.toLowerCase().includes(q) ||
            v.color.toLowerCase().includes(q) ||
            (v.sku && v.sku.toLowerCase().includes(q))
        )
    );
  }, [groups, search]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  async function handleSave(variantId: string) {
    setSaving(true);
    await onUpdateStock(variantId, parseInt(editValue) || 0);
    setSaving(false);
    setEditingId(null);
  }

  function getStockStatus(qty: number) {
    if (qty === 0) return { label: t("inventory.outOfStock"), className: "bg-red-100 text-red-800" };
    if (qty <= 5) return { label: t("inventory.lowStock"), className: "bg-amber-100 text-amber-800" };
    return { label: t("inventory.inStock"), className: "bg-green-100 text-green-800" };
  }

  function toggleGroup(slug: string) {
    setExpanded((prev) => ({ ...prev, [slug]: !prev[slug] }));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{t("inventory.title")}</h1>
        <span className="text-sm text-muted-foreground">
          {items.length} {t("inventory.variant")}
        </span>
      </div>

      {/* Search */}
      <div className="max-w-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder={t("inventory.product") + " / " + t("variants.sku") + "..."}
            className="w-full h-9 rounded-lg border border-input bg-background pl-9 pr-3 text-sm"
          />
        </div>
      </div>

      {/* Grouped inventory */}
      <div className="space-y-3">
        {paginated.map((group) => {
          const isExpanded = expanded[group.slug];

          return (
            <div key={group.slug} className="bg-card rounded-xl shadow-warm-sm overflow-hidden">
              {/* Product header */}
              <button
                onClick={() => toggleGroup(group.slug)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors text-left"
              >
                <div className="flex items-center gap-3">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="font-medium">{group.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {group.variants.length} {t("inventory.variant")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {group.hasOutOfStock && (
                    <Badge variant="secondary" className="bg-red-100 text-red-800 text-xs">
                      {t("inventory.outOfStock")}
                    </Badge>
                  )}
                  {group.hasLowStock && !group.hasOutOfStock && (
                    <Badge variant="secondary" className="bg-amber-100 text-amber-800 text-xs">
                      {t("inventory.lowStock")}
                    </Badge>
                  )}
                  <span className="text-sm text-muted-foreground">
                    {t("inventory.stock")}: {group.totalStock}
                  </span>
                </div>
              </button>

              {/* Variants table */}
              {isExpanded && (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-t border-b border-border text-left bg-muted/20">
                      <th className="px-4 py-2 font-medium text-muted-foreground pl-11">{t("variants.size")}</th>
                      <th className="px-4 py-2 font-medium text-muted-foreground">{t("variants.color")}</th>
                      <th className="px-4 py-2 font-medium text-muted-foreground">{t("variants.sku")}</th>
                      <th className="px-4 py-2 font-medium text-muted-foreground">{t("inventory.stock")}</th>
                      <th className="px-4 py-2 font-medium text-muted-foreground">{t("inventory.status")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.variants.map((item) => {
                      const status = getStockStatus(item.stock_quantity);
                      const isEditing = editingId === item.id;

                      return (
                        <tr
                          key={item.id}
                          className={`border-b border-border/50 ${
                            item.stock_quantity === 0
                              ? "bg-red-50/50"
                              : item.stock_quantity <= 5
                              ? "bg-amber-50/50"
                              : ""
                          }`}
                        >
                          <td className="px-4 py-2.5 pl-11">{item.size}</td>
                          <td className="px-4 py-2.5">{item.color}</td>
                          <td className="px-4 py-2.5 text-xs font-mono text-muted-foreground">
                            {item.sku || "—"}
                          </td>
                          <td className="px-4 py-2.5">
                            {isEditing ? (
                              <div className="flex items-center gap-1.5">
                                <Input
                                  type="number"
                                  min="0"
                                  value={editValue}
                                  onChange={(e) => setEditValue(e.target.value)}
                                  className="h-7 w-20 text-xs bg-background"
                                  autoFocus
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") handleSave(item.id);
                                    if (e.key === "Escape") setEditingId(null);
                                  }}
                                />
                                <button
                                  onClick={() => handleSave(item.id)}
                                  disabled={saving}
                                  className="p-1 rounded bg-primary text-primary-foreground hover:opacity-90"
                                >
                                  {saving ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  ) : (
                                    <Check className="h-3.5 w-3.5" />
                                  )}
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setEditingId(item.id);
                                  setEditValue(String(item.stock_quantity));
                                }}
                                className="font-medium hover:text-primary transition-colors cursor-pointer"
                              >
                                {item.stock_quantity}
                              </button>
                            )}
                          </td>
                          <td className="px-4 py-2.5">
                            <Badge variant="secondary" className={status.className}>
                              {status.label}
                            </Badge>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="bg-card rounded-xl shadow-warm-sm px-4 py-8 text-center text-muted-foreground">
            {t("inventory.noItems")}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {t("orders.page")} {page} {t("orders.of")} {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-input bg-background text-sm hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
              {t("orders.prev")}
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-input bg-background text-sm hover:bg-muted/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("orders.next")}
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
