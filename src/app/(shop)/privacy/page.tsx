"use client";

import { useShopT } from "@/lib/shop-i18n";

export default function PrivacyPage() {
  const t = useShopT();

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <h1 className="font-[family-name:var(--font-playfair)] text-4xl mb-6">{t("privacy.title")}</h1>
      <div className="space-y-6 text-sm text-muted-foreground leading-relaxed">
        <p>{t("privacy.updated")}</p>
        <section>
          <h2 className="text-base font-medium text-foreground mb-2">{t("privacy.collectTitle")}</h2>
          <p>{t("privacy.collectText")}</p>
        </section>
        <section>
          <h2 className="text-base font-medium text-foreground mb-2">{t("privacy.useTitle")}</h2>
          <p>{t("privacy.useText")}</p>
        </section>
        <section>
          <h2 className="text-base font-medium text-foreground mb-2">{t("privacy.securityTitle")}</h2>
          <p>{t("privacy.securityText")}</p>
        </section>
        <section>
          <h2 className="text-base font-medium text-foreground mb-2">{t("privacy.rightsTitle")}</h2>
          <p>{t("privacy.rightsText")}</p>
        </section>
        <section>
          <h2 className="text-base font-medium text-foreground mb-2">{t("privacy.contactTitle")}</h2>
          <p>{t("privacy.contactText")}</p>
        </section>
      </div>
    </div>
  );
}
