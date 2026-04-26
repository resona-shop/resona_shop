"use client";

import { useShopT } from "@/lib/shop-i18n";

export default function SizeGuidePage() {
  const t = useShopT();
  const sizes = [
    { size: "XS", bust: "80-84", waist: "60-64", hips: "86-90" },
    { size: "S", bust: "84-88", waist: "64-68", hips: "90-94" },
    { size: "M", bust: "88-92", waist: "68-72", hips: "94-98" },
    { size: "L", bust: "92-96", waist: "72-76", hips: "98-102" },
    { size: "XL", bust: "96-100", waist: "76-80", hips: "102-106" },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <h1 className="font-[family-name:var(--font-playfair)] text-4xl mb-6">{t("sizeGuide.title")}</h1>
      <p className="text-muted-foreground mb-8">{t("sizeGuide.intro")}</p>
      <div className="bg-card rounded-xl shadow-warm-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-4 py-3 font-medium">{t("sizeGuide.size")}</th>
              <th className="px-4 py-3 font-medium">{t("sizeGuide.bust")}</th>
              <th className="px-4 py-3 font-medium">{t("sizeGuide.waist")}</th>
              <th className="px-4 py-3 font-medium">{t("sizeGuide.hips")}</th>
            </tr>
          </thead>
          <tbody>
            {sizes.map((s) => (
              <tr key={s.size} className="border-b border-border/50">
                <td className="px-4 py-3 font-medium">{s.size}</td>
                <td className="px-4 py-3 text-muted-foreground">{s.bust}</td>
                <td className="px-4 py-3 text-muted-foreground">{s.waist}</td>
                <td className="px-4 py-3 text-muted-foreground">{s.hips}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-sm text-muted-foreground mt-4">{t("sizeGuide.help")}</p>
    </div>
  );
}
