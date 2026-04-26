"use client";

import { useShopT } from "@/lib/shop-i18n";

export function BrandStory() {
  const t = useShopT();

  return (
    <section className="py-20 lg:py-32 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-[#FDD15E]/8 blur-3xl" />

      <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm font-medium tracking-widest uppercase text-primary/80 mb-6">
          {t("brand.tagline")}
        </p>

        <h2 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl leading-tight tracking-tight">
          {t("brand.title1")}{" "}
          <span className="text-gradient-golden">{t("brand.goldenHour")}</span>{" "}
          {t("brand.title2")}{" "}
          <span className="text-gradient-coral">{t("brand.you")}</span>.
        </h2>

        <p className="mt-8 text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          {t("brand.story")}
        </p>

        <div className="mt-12 flex items-center justify-center gap-8 text-sm text-muted-foreground">
          <div className="text-center">
            <p className="font-[family-name:var(--font-playfair)] text-2xl text-foreground">100%</p>
            <p className="mt-1">{t("brand.sustainable")}</p>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="text-center">
            <p className="font-[family-name:var(--font-playfair)] text-2xl text-foreground">SEA</p>
            <p className="mt-1">{t("brand.born")}</p>
          </div>
          <div className="w-px h-10 bg-border" />
          <div className="text-center">
            <p className="font-[family-name:var(--font-playfair)] text-2xl text-foreground">XS-XL</p>
            <p className="mt-1">{t("brand.sizing")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
