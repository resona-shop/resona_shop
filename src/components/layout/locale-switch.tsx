"use client";

import { useShopLocale } from "@/lib/shop-i18n";
import { Globe } from "lucide-react";

export function LocaleSwitch() {
  const { locale, toggle } = useShopLocale();

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-foreground/70 hover:text-foreground hover:bg-secondary/50 transition-colors"
      aria-label="Switch language"
    >
      <Globe className="h-3.5 w-3.5" />
      {locale === "en" ? "VI" : "EN"}
    </button>
  );
}
