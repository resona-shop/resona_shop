"use client";

import { useShopT } from "@/lib/shop-i18n";

export default function CareersPage() {
  const t = useShopT();

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <h1 className="font-[family-name:var(--font-playfair)] text-4xl mb-6">{t("careers.title")}</h1>
      <div className="space-y-4 text-base text-muted-foreground leading-relaxed">
        <p>{t("careers.intro")}</p>
        <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-foreground mt-8">{t("careers.openPositions")}</h2>
        <p>{t("careers.noPositions")}</p>
        <p>{t("careers.cta")}</p>
      </div>
    </div>
  );
}
