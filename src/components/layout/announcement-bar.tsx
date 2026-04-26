"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useShopT } from "@/lib/shop-i18n";

export function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  const t = useShopT();

  useEffect(() => {
    const dismissed = sessionStorage.getItem("announcement-dismissed");
    if (dismissed) setVisible(false);
  }, []);

  if (!visible) return null;

  return (
    <div className="bg-gradient-golden text-white text-center text-xs sm:text-sm py-2 px-4 relative">
      <p className="font-medium">{t("announce.freeShipping")}</p>
      <button
        onClick={() => {
          setVisible(false);
          sessionStorage.setItem("announcement-dismissed", "true");
        }}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:opacity-70 transition-opacity"
        aria-label="Dismiss"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
