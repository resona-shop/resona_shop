"use client";

import { useShopT } from "@/lib/shop-i18n";

export default function TermsPage() {
  const t = useShopT();

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <h1 className="font-[family-name:var(--font-playfair)] text-4xl mb-6">{t("terms.title")}</h1>
      <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
        <p>{t("terms.updated")}</p>
        <section>
          <h2 className="text-base font-medium text-foreground mb-2">{t("terms.generalTitle")}</h2>
          <p>{t("terms.generalText")}</p>
        </section>
        <section>
          <h2 className="text-base font-medium text-foreground mb-2">{t("terms.ordersTitle")}</h2>
          <p>{t("terms.ordersText")}</p>
        </section>
        <section>
          <h2 className="text-base font-medium text-foreground mb-2">{t("terms.shippingTitle")}</h2>
          <p>{t("terms.shippingText")}</p>
        </section>
        <section>
          <h2 className="text-base font-medium text-foreground mb-2">{t("terms.ipTitle")}</h2>
          <p>{t("terms.ipText")}</p>
        </section>
        <section>
          <h2 className="text-base font-medium text-foreground mb-2">{t("terms.contactTitle")}</h2>
          <p>{t("terms.contactText")}</p>
        </section>
      </div>
    </div>
  );
}
