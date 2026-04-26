"use client";

import { useShopT } from "@/lib/shop-i18n";

export function AccountSettingsContent({ children }: { children: React.ReactNode }) {
  const t = useShopT();

  return (
    <div>
      <h2 className="text-xl font-medium mb-6">{t("account.accountSettings")}</h2>
      <div className="bg-card rounded-xl shadow-warm-sm p-6">
        {children}
      </div>
    </div>
  );
}
