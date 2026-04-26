"use client";

import type { Product } from "@/types";
import { ProductCard } from "./product-card";
import { useShopT } from "@/lib/shop-i18n";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  const t = useShopT();

  if (products.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-muted-foreground">{t("products.noProducts")}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
