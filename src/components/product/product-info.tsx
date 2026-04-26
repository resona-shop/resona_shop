"use client";

import { useState } from "react";
import type { Product, ProductVariant } from "@/types";
import { formatPrice, cn } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Minus, Plus, Check } from "lucide-react";
import { WishlistButton } from "./wishlist-button";
import { useShopT, useProductT } from "@/lib/shop-i18n";

interface ProductInfoProps {
  product: Product;
  wishlisted?: boolean;
}

export function ProductInfo({ product, wishlisted = false }: ProductInfoProps) {
  const variants = product.variants || [];
  const addItem = useCart((s) => s.addItem);
  const t = useShopT();
  const pt = useProductT();

  const sizes = [...new Set(variants.map((v) => v.size))];
  const colors = [...new Set(variants.map((v) => v.color))];

  const [selectedSize, setSelectedSize] = useState(sizes[0] || "");
  const [selectedColor, setSelectedColor] = useState(colors[0] || "");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const selectedVariant = variants.find(
    (v) => v.size === selectedSize && v.color === selectedColor
  );

  const price = selectedVariant?.price_override ?? product.base_price;
  const inStock = selectedVariant ? selectedVariant.stock_quantity > 0 : false;

  function handleAddToCart() {
    if (!selectedVariant) return;
    addItem(product, selectedVariant, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  const description = pt.desc(product.slug, product.description);

  return (
    <div className="space-y-6">
      {product.category && (
        <p className="text-sm text-muted-foreground uppercase tracking-wider">
          {product.category.name}
        </p>
      )}

      <h1 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl tracking-tight">
        {pt.name(product.slug, product.name)}
      </h1>

      <div className="flex items-baseline gap-3">
        <span className="text-2xl font-medium">
          {formatPrice(price, product.currency)}
        </span>
        {product.compare_at_price && (
          <span className="text-lg text-muted-foreground line-through">
            {formatPrice(product.compare_at_price, product.currency)}
          </span>
        )}
        {product.compare_at_price && (
          <span className="text-sm font-medium text-primary">
            {Math.round(
              ((product.compare_at_price - price) / product.compare_at_price) * 100
            )}
            % {t("product.off")}
          </span>
        )}
      </div>

      {description && (
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      )}

      {colors.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-2">
            {t("product.color")}: <span className="text-muted-foreground">{selectedColor}</span>
          </p>
          <div className="flex gap-2">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm border transition-all",
                  selectedColor === color
                    ? "border-primary bg-primary/5 text-primary shadow-glow-coral"
                    : "border-border hover:border-primary/50"
                )}
              >
                {color}
              </button>
            ))}
          </div>
        </div>
      )}

      {sizes.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-2">
            {t("product.size")}: <span className="text-muted-foreground">{selectedSize}</span>
          </p>
          <div className="flex gap-2">
            {sizes.map((size) => {
              const variant = variants.find(
                (v) => v.size === size && v.color === selectedColor
              );
              const available = variant ? variant.stock_quantity > 0 : false;
              return (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  disabled={!available}
                  className={cn(
                    "w-12 h-12 rounded-lg text-sm font-medium border transition-all",
                    selectedSize === size
                      ? "border-primary bg-primary/5 text-primary shadow-glow-coral"
                      : "border-border hover:border-primary/50",
                    !available && "opacity-30 cursor-not-allowed line-through"
                  )}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 pt-2">
        <div className="flex items-center border border-border rounded-lg">
          <button
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="p-3 hover:bg-secondary/50 transition-colors rounded-l-lg"
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-12 text-center text-sm font-medium">{quantity}</span>
          <button
            onClick={() => setQuantity((q) => q + 1)}
            className="p-3 hover:bg-secondary/50 transition-colors rounded-r-lg"
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>

        <Button
          onClick={handleAddToCart}
          disabled={!selectedVariant || !inStock}
          size="lg"
          className={cn(
            "flex-1 h-12 text-base transition-all",
            added
              ? "bg-emerald-soft text-white"
              : "bg-gradient-golden text-white shadow-glow-coral hover:opacity-90"
          )}
        >
          {added ? (
            <>
              <Check className="mr-2 h-5 w-5" />
              {t("product.added")}
            </>
          ) : !inStock ? (
            t("product.outOfStock")
          ) : (
            <>
              <ShoppingBag className="mr-2 h-5 w-5" />
              {t("product.addToCart")}
            </>
          )}
        </Button>

        <WishlistButton productId={product.id} initialWishlisted={wishlisted} />
      </div>

      {selectedVariant && inStock && selectedVariant.stock_quantity <= 5 && (
        <p className="text-sm text-primary font-medium">
          {t("product.onlyLeft").replace("{n}", String(selectedVariant.stock_quantity))}
        </p>
      )}
    </div>
  );
}
