"use client";

import { useState } from "react";
import { useT } from "@/lib/admin-i18n";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { SIZES } from "@/lib/constants";
import type { ProductVariant } from "@/types";

interface VariantItem {
  size: string;
  color: string;
  sku: string;
  price_override: string;
  stock_quantity: string;
  is_active: boolean;
}

interface VariantEditorProps {
  existingVariants?: ProductVariant[];
  onChange: (variants: VariantItem[]) => void;
}

const emptyVariant: VariantItem = {
  size: "M",
  color: "",
  sku: "",
  price_override: "",
  stock_quantity: "0",
  is_active: true,
};

export function VariantEditor({ existingVariants = [], onChange }: VariantEditorProps) {
  const t = useT();
  const [variants, setVariants] = useState<VariantItem[]>(
    existingVariants.length > 0
      ? existingVariants.map((v) => ({
          size: v.size,
          color: v.color,
          sku: v.sku || "",
          price_override: v.price_override ? String(v.price_override) : "",
          stock_quantity: String(v.stock_quantity),
          is_active: v.is_active,
        }))
      : []
  );

  function update(newVariants: VariantItem[]) {
    setVariants(newVariants);
    onChange(newVariants);
  }

  function addVariant() {
    update([...variants, { ...emptyVariant }]);
  }

  function removeVariant(index: number) {
    update(variants.filter((_, i) => i !== index));
  }

  function updateVariant(index: number, field: keyof VariantItem, value: string | boolean) {
    const updated = variants.map((v, i) =>
      i === index ? { ...v, [field]: value } : v
    );
    update(updated);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label>{t("variants.title")}</Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addVariant}
          className="text-xs"
        >
          <Plus className="h-3 w-3 mr-1" />
          {t("variants.add")}
        </Button>
      </div>

      {variants.length === 0 && (
        <p className="text-sm text-muted-foreground py-4 text-center border border-dashed border-border rounded-lg">
          {t("variants.empty")}
        </p>
      )}

      {variants.map((variant, index) => (
        <div
          key={index}
          className="grid grid-cols-6 gap-2 items-end p-3 bg-muted/30 rounded-lg"
        >
          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">{t("variants.size")}</label>
            <select
              value={variant.size}
              onChange={(e) => updateVariant(index, "size", e.target.value)}
              className="w-full h-8 rounded-md border border-input bg-background px-2 text-xs"
            >
              {SIZES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">{t("variants.color")}</label>
            <Input
              value={variant.color}
              onChange={(e) => updateVariant(index, "color", e.target.value)}
              placeholder="e.g. Coral"
              className="h-8 text-xs bg-background"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">{t("variants.stock")}</label>
            <Input
              type="number"
              min="0"
              value={variant.stock_quantity}
              onChange={(e) => updateVariant(index, "stock_quantity", e.target.value)}
              className="h-8 text-xs bg-background"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">{t("variants.priceOverride")}</label>
            <Input
              type="number"
              step="0.01"
              min="0"
              value={variant.price_override}
              onChange={(e) => updateVariant(index, "price_override", e.target.value)}
              placeholder="—"
              className="h-8 text-xs bg-background"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-muted-foreground">{t("variants.sku")}</label>
            <Input
              value={variant.sku}
              onChange={(e) => updateVariant(index, "sku", e.target.value)}
              placeholder="Optional"
              className="h-8 text-xs bg-background"
            />
          </div>

          <div className="flex items-center gap-2 pb-0.5">
            <Checkbox
              checked={variant.is_active}
              onCheckedChange={(checked) =>
                updateVariant(index, "is_active", !!checked)
              }
            />
            <button
              type="button"
              onClick={() => removeVariant(index)}
              className="p-1.5 text-destructive hover:bg-destructive/10 rounded transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
