"use client";

import { useShopT } from "@/lib/shop-i18n";

export default function ContactPage() {
  const t = useShopT();

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <h1 className="font-[family-name:var(--font-playfair)] text-4xl mb-6">{t("contact.title")}</h1>
      <p className="text-muted-foreground mb-8">{t("contact.intro")}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl shadow-warm-sm p-6">
          <h2 className="font-medium mb-2">{t("contact.email")}</h2>
          <p className="text-sm text-muted-foreground">support@resona.com</p>
        </div>
        <div className="bg-card rounded-xl shadow-warm-sm p-6">
          <h2 className="font-medium mb-2">{t("contact.social")}</h2>
          <p className="text-sm text-muted-foreground">@resona.official on Instagram</p>
        </div>
        <div className="bg-card rounded-xl shadow-warm-sm p-6">
          <h2 className="font-medium mb-2">{t("contact.hours")}</h2>
          <p className="text-sm text-muted-foreground">{t("contact.hoursValue")}</p>
        </div>
        <div className="bg-card rounded-xl shadow-warm-sm p-6">
          <h2 className="font-medium mb-2">{t("contact.location")}</h2>
          <p className="text-sm text-muted-foreground">Singapore</p>
        </div>
      </div>
    </div>
  );
}
