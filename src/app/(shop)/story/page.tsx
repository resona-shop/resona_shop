"use client";

import { useShopT } from "@/lib/shop-i18n";

export default function StoryPage() {
  const t = useShopT();

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <h1 className="font-[family-name:var(--font-playfair)] text-4xl mb-6">{t("story.title")}</h1>
      <div className="space-y-4 text-base text-muted-foreground leading-relaxed">
        <p>{t("story.p1")}</p>
        <p>{t("story.p2")}</p>
        <p>{t("story.p3")}</p>
        <p>{t("story.p4")}</p>
        <p className="font-medium text-foreground italic">{t("story.quote")}</p>
      </div>
    </div>
  );
}
