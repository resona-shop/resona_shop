"use client";

import { useState, useCallback } from "react";
import type { Category, Product } from "@/types";
import { useT } from "@/lib/admin-i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { ImageUpload } from "./image-upload";
import { VariantEditor } from "./variant-editor";

interface ImageItem {
  id?: string;
  url: string;
  is_primary: boolean;
  sort_order: number;
}

interface VariantItem {
  size: string;
  color: string;
  sku: string;
  price_override: string;
  stock_quantity: string;
  is_active: boolean;
}

interface ProductFormProps {
  categories: Category[];
  product?: Product;
  action: (formData: FormData) => Promise<{ error: string } | undefined | void>;
}

export function ProductForm({ categories, product, action }: ProductFormProps) {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [variants, setVariants] = useState<VariantItem[]>([]);
  const t = useT();

  const handleImagesChange = useCallback((newImages: ImageItem[]) => {
    setImages(newImages);
  }, []);

  const handleVariantsChange = useCallback((newVariants: VariantItem[]) => {
    setVariants(newVariants);
  }, []);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    formData.set("images", JSON.stringify(images));
    formData.set("variants", JSON.stringify(variants));
    await action(formData);
    setLoading(false);
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">{t("form.name")}</Label>
        <Input
          id="name"
          name="name"
          required
          defaultValue={product?.name || ""}
          className="bg-background"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">{t("form.description")}</Label>
        <Textarea
          id="description"
          name="description"
          rows={4}
          defaultValue={product?.description || ""}
          className="bg-background"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="base_price">{t("form.price")}</Label>
          <Input
            id="base_price"
            name="base_price"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={product?.base_price || ""}
            className="bg-background"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="compare_at_price">{t("form.comparePrice")}</Label>
          <Input
            id="compare_at_price"
            name="compare_at_price"
            type="number"
            step="0.01"
            min="0"
            defaultValue={product?.compare_at_price || ""}
            className="bg-background"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category_id">{t("form.category")}</Label>
        <select
          id="category_id"
          name="category_id"
          defaultValue={product?.category_id || ""}
          className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">{t("form.noCategory")}</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <ImageUpload
        existingImages={product?.images}
        onChange={handleImagesChange}
      />

      <VariantEditor
        existingVariants={product?.variants}
        onChange={handleVariantsChange}
      />

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <Checkbox
            id="is_active"
            name="is_active"
            defaultChecked={product?.is_active ?? true}
          />
          <Label htmlFor="is_active" className="text-sm font-normal">
            {t("form.isActive")}
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="is_featured"
            name="is_featured"
            defaultChecked={product?.is_featured ?? false}
          />
          <Label htmlFor="is_featured" className="text-sm font-normal">
            {t("form.isFeatured")}
          </Label>
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="bg-gradient-golden text-white hover:opacity-90"
      >
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {product ? t("form.update") : t("form.create")}
      </Button>
    </form>
  );
}
