"use client";

import { useShopT } from "@/lib/shop-i18n";

export default function SustainabilityPage() {
  const t = useShopT();

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <h1 className="font-[family-name:var(--font-playfair)] text-4xl mb-6">{t("sustainability.title")}</h1>
      <div className="space-y-4 text-base text-muted-foreground leading-relaxed">
        <p>{t("sustainability.intro")}</p>
        <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-foreground mt-8">{t("sustainability.commitTitle")}</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>{t("sustainability.c1")}</li>
          <li>{t("sustainability.c2")}</li>
          <li>{t("sustainability.c3")}</li>
          <li>{t("sustainability.c4")}</li>
          <li>{t("sustainability.c5")}</li>
        </ul>
        <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-foreground mt-8">{t("sustainability.goalTitle")}</h2>
        <p>{t("sustainability.goalText")}</p>
      </div>
    </div>
  );
}
