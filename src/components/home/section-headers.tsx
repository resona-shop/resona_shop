"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useShopT } from "@/lib/shop-i18n";

export function FeaturedHeader() {
  const t = useShopT();
  return (
    <div className="flex items-end justify-between mb-10">
      <div>
        <p className="text-sm font-medium tracking-widest uppercase text-primary/80 mb-2">
          {t("featured.tagline")}
        </p>
        <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl tracking-tight">
          {t("featured.title")}
        </h2>
      </div>
      <Link
        href="/products"
        className="hidden sm:flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
      >
        {t("featured.viewAll")}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

export function FeaturedFooter() {
  const t = useShopT();
  return (
    <div className="mt-8 text-center sm:hidden">
      <Link
        href="/products"
        className="inline-flex items-center gap-1 text-sm font-medium text-primary"
      >
        {t("featured.viewAllProducts")}
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

export function CollectionHeader() {
  const t = useShopT();
  return (
    <div className="text-center mb-10">
      <p className="text-sm font-medium tracking-widest uppercase text-primary/80 mb-2">
        {t("collections.tagline")}
      </p>
      <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl tracking-tight">
        {t("collections.title")}
      </h2>
    </div>
  );
}

export function CollectionShopNow() {
  const t = useShopT();
  return (
    <span className="mt-3 text-xs font-medium text-white/80 group-hover:text-[#FDD15E] transition-colors">
      {t("collections.shopNow")} &rarr;
    </span>
  );
}
