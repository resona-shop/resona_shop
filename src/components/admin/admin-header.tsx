"use client";

import { useAdminLocale, useT } from "@/lib/admin-i18n";
import { Globe } from "lucide-react";

export function AdminHeader({ userName }: { userName: string }) {
  const { locale, toggle } = useAdminLocale();
  const t = useT();

  return (
    <header className="sticky top-0 z-40 glass-warm border-b border-border/50 px-6 py-3 flex items-center justify-between">
      <h2 className="text-sm font-medium text-muted-foreground">
        {t("admin.title")}
      </h2>
      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors"
        >
          <Globe className="h-3.5 w-3.5" />
          {locale === "zh" ? "EN" : "中文"}
        </button>
        <p className="text-sm text-muted-foreground">{userName}</p>
      </div>
    </header>
  );
}
