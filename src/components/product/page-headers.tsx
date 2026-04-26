"use client";

import { useShopT } from "@/lib/shop-i18n";

export function ProductsPageHeader({ search }: { search?: string }) {
  const t = useShopT();
  return (
    <div className="mb-8">
      <h1 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl tracking-tight">
        {search ? `${t("products.results")} "${search}"` : t("products.title")}
      </h1>
      <p className="text-muted-foreground mt-2">{t("products.subtitle")}</p>
    </div>
  );
}

export function ProductsAllLabel() {
  const t = useShopT();
  return <>{t("products.all")}</>;
}

export function CollectionsPageHeader() {
  const t = useShopT();
  return (
    <div className="mb-8">
      <h1 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl tracking-tight">
        {t("collections.title")}
      </h1>
      <p className="text-muted-foreground mt-2">{t("collections.subtitle")}</p>
    </div>
  );
}

export function CollectionsExploreLabel() {
  const t = useShopT();
  return <>{t("collections.explore")} &rarr;</>;
}

export function CollectionsEmpty() {
  const t = useShopT();
  return (
    <p className="text-muted-foreground col-span-full text-center py-12">
      {t("collections.comingSoon")}
    </p>
  );
}

export function ProductsEmpty() {
  const t = useShopT();
  return (
    <div className="text-center py-20">
      <p className="text-muted-foreground">{t("products.noProducts")}</p>
    </div>
  );
}
