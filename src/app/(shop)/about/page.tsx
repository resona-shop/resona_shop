"use client";

import { useShopT } from "@/lib/shop-i18n";

export default function AboutPage() {
  const t = useShopT();

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <h1 className="font-[family-name:var(--font-playfair)] text-4xl mb-6">{t("about.title")}</h1>
      <div className="prose prose-warm text-muted-foreground space-y-4 text-base leading-relaxed">
        <p>{t("about.p1")}</p>
        <p>{t("about.p2")}</p>
        <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-foreground mt-8">{t("about.mission")}</h2>
        <p>{t("about.missionText")}</p>
        <h2 className="font-[family-name:var(--font-playfair)] text-2xl text-foreground mt-8">{t("about.madeIn")}</h2>
        <p>{t("about.madeInText")}</p>
      </div>
    </div>
  );
}
