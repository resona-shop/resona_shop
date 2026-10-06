"use client";

import Link from "next/link";
import type { Product } from "@/types";
import { ProductCard } from "@/components/product/product-card";
import { useShopT } from "@/lib/shop-i18n";

export function WishlistContent({ products }: { products: Product[] }) {
  const t = useShopT();

  return (
    <div>
      <h2 className="text-xl font-medium mb-6">{t("account.wishlist")}</h2>
      {products.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8 text-center bg-card rounded-xl">
          {t("account.wishlistEmpty")}{" "}
          <Link href="/products" className="text-primary hover:underline">
            {t("account.startShopping")}
          </Link>
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
