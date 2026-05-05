"use client";

import { useShopLocale } from "@/lib/shop-i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

export function LocaleSwitch() {
  const { locale, setLocale } = useShopLocale();
  const current = locale === "en"
    ? { flag: "🇺🇸", label: "English" }
    : { flag: "🇻🇳", label: "Tiếng Việt" };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="flex items-center gap-2 px-2 py-1 text-xs font-medium text-foreground/70 transition-colors hover:text-foreground"
        aria-label="Switch language"
      >
        <span aria-hidden="true">{current.flag}</span>
        <span>{current.label}</span>
        <ChevronDown className="h-3.5 w-3.5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        <DropdownMenuItem onClick={() => setLocale("en")}>
          <span aria-hidden="true">🇺🇸</span>
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLocale("vi")}>
          <span aria-hidden="true">🇻🇳</span>
          Tiếng Việt
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
