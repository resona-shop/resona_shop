"use client";

import { useShopT } from "@/lib/shop-i18n";

export default function FAQPage() {
  const t = useShopT();
  const faqs = Array.from({ length: 8 }, (_, i) => ({
    q: t(`faq.q${i + 1}` as any),
    a: t(`faq.a${i + 1}` as any),
  }));

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <h1 className="font-[family-name:var(--font-playfair)] text-4xl mb-6">{t("faq.title")}</h1>
      <div className="space-y-6">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-card rounded-xl shadow-warm-sm p-5">
            <h2 className="font-medium mb-2">{faq.q}</h2>
            <p className="text-sm text-muted-foreground">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
