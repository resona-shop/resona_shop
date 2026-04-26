"use client";

import Link from "next/link";
import Image from "next/image";
import type { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import { ShoppingBag } from "lucide-react";
import { useShopT, useProductT } from "@/lib/shop-i18n";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const addItem = useCart((s) => s.addItem);
  const t = useShopT();
  const pt = useProductT();
  const primaryImage = product.images?.find((img) => img.is_primary) || product.images?.[0];
  const secondImage = product.images?.find((img) => !img.is_primary && img.sort_order === 1);
  const firstVariant = product.variants?.[0];

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (firstVariant) {
      addItem(product, firstVariant);
    }
  }

  return (
    <Link href={`/products/${product.slug}`} className="group">
      <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-secondary/50 mb-3 shadow-warm-sm group-hover:shadow-warm transition-all duration-300">
        {primaryImage ? (
          <>
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt_text || product.name}
              fill
              className="object-cover transition-opacity duration-500 group-hover:opacity-0"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
            {secondImage && (
              <Image
                src={secondImage.url}
                alt={product.name}
                fill
                className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            )}
          </>
        ) : (
          <div className="absolute inset-0 shimmer" />
        )}

        {product.compare_at_price && (
          <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-md">
            {t("products.sale")}
          </span>
        )}

        {firstVariant && (
          <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
            <button
              onClick={handleQuickAdd}
              className="w-full py-2.5 rounded-lg glass text-sm font-medium text-foreground hover:bg-white transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag className="h-4 w-4" />
              {t("products.quickAdd")}
            </button>
          </div>
        )}
      </div>

      <h3 className="text-sm font-medium group-hover:text-primary transition-colors line-clamp-1">
        {pt.name(product.slug, product.name)}
      </h3>
      <div className="flex items-center gap-2 mt-0.5">
        <p className="text-sm text-foreground font-medium">
          {formatPrice(product.base_price, product.currency)}
        </p>
        {product.compare_at_price && (
          <p className="text-xs text-muted-foreground line-through">
            {formatPrice(product.compare_at_price, product.currency)}
          </p>
        )}
      </div>
    </Link>
  );
}
