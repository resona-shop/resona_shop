"use client";

import { useShopT } from "@/lib/shop-i18n";

export default function ShippingPage() {
  const t = useShopT();

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <h1 className="font-[family-name:var(--font-playfair)] text-4xl mb-6">{t("shipping.title")}</h1>
      <div className="space-y-8 text-base leading-relaxed text-muted-foreground">
        <section>
          <h2 className="text-lg font-medium text-foreground mb-2">{t("shipping.shippingTitle")}</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>{t("shipping.s1")}</li>
            <li>{t("shipping.s2")}</li>
            <li>{t("shipping.s3")}</li>
            <li>{t("shipping.s4")}</li>
          </ul>
        </section>
        <section>
          <h2 className="text-lg font-medium text-foreground mb-2">{t("shipping.returnsTitle")}</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>{t("shipping.r1")}</li>
            <li>{t("shipping.r2")}</li>
            <li>{t("shipping.r3")}</li>
            <li>{t("shipping.r4")}</li>
          </ul>
        </section>
        <section>
          <h2 className="text-lg font-medium text-foreground mb-2">{t("shipping.exchangeTitle")}</h2>
          <p>{t("shipping.exchangeText")}</p>
        </section>
      </div>
    </div>
  );
}
