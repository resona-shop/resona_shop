"use client";

import { useState } from "react";
import { useT } from "@/lib/admin-i18n";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Check, Loader2 } from "lucide-react";

interface InventoryItem {
  id: string;
  size: string;
  color: string;
  sku: string | null;
  stock_quantity: number;
  is_active: boolean;
  product: { name: string; slug: string } | null;
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

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{t("inventory.title")}</h1>

      <div className="bg-card rounded-xl shadow-warm-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-4 py-3 font-medium text-muted-foreground">{t("inventory.product")}</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">{t("inventory.variant")}</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">{t("variants.sku")}</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">{t("inventory.stock")}</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">{t("inventory.status")}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
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
                  <td className="px-4 py-3 font-medium">
                    {item.product?.name || "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {item.size} / {item.color}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs font-mono">
                    {item.sku || "—"}
                  </td>
                  <td className="px-4 py-3">
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
                  <td className="px-4 py-3">
                    <Badge variant="secondary" className={status.className}>
                      {status.label}
                    </Badge>
                  </td>
                </tr>
              );
            })}
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  {t("inventory.noItems")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
