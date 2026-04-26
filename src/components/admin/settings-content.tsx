"use client";

import { useT } from "@/lib/admin-i18n";

export function SettingsContent({
  stripeConnected,
  supabaseConnected,
}: {
  stripeConnected: boolean;
  supabaseConnected: boolean;
}) {
  const t = useT();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{t("settings.title")}</h1>

      <div className="bg-card rounded-xl shadow-warm-sm p-6 max-w-lg">
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium">{t("settings.storeName")}</p>
            <p className="text-sm text-muted-foreground">Resona</p>
          </div>
          <div>
            <p className="text-sm font-medium">{t("settings.currency")}</p>
            <p className="text-sm text-muted-foreground">USD</p>
          </div>
          <div>
            <p className="text-sm font-medium">{t("settings.freeShipping")}</p>
            <p className="text-sm text-muted-foreground">$80.00</p>
          </div>
          <div>
            <p className="text-sm font-medium">{t("settings.shippingRate")}</p>
            <p className="text-sm text-muted-foreground">$9.99</p>
          </div>
          <div>
            <p className="text-sm font-medium">{t("settings.stripe")}</p>
            <p className="text-sm text-muted-foreground">
              {stripeConnected ? t("settings.connected") : t("settings.notConfigured")}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Supabase</p>
            <p className="text-sm text-muted-foreground">
              {supabaseConnected ? t("settings.connected") : t("settings.notConfigured")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
