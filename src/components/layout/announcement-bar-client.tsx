"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useShopT, useShopLocale } from "@/lib/shop-i18n";

export function AnnouncementBarClient({ en, vi }: { en?: string; vi?: string }) {
  const [visible, setVisible] = useState(true);
  const t = useShopT();
  const locale = useShopLocale((s) => s.locale);

  const text = (locale === "vi" ? vi || en : en) || t("announce.freeShipping");
  // A new announcement shows again even if the previous one was dismissed.
  const storageKey = `announcement-dismissed:${en || "default"}`;

  useEffect(() => {
    setVisible(!sessionStorage.getItem(storageKey));
  }, [storageKey]);

  if (!visible) return null;

  return (
    <div className="bg-gradient-golden text-white text-center text-xs sm:text-sm py-2 px-4 relative">
      <p className="font-medium">{text}</p>
      <button
        onClick={() => {
          setVisible(false);
          sessionStorage.setItem(storageKey, "true");
        }}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:opacity-70 transition-opacity"
        aria-label="Dismiss"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
