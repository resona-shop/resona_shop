"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useShopT } from "@/lib/shop-i18n";

const linkClass =
  "inline-flex items-center gap-1 px-4 py-2 rounded-lg border border-border text-sm hover:bg-secondary/50 transition-colors";

export function ProductsPagination({
  page,
  totalPages,
  prevHref,
  nextHref,
}: {
  page: number;
  totalPages: number;
  prevHref: string | null;
  nextHref: string | null;
}) {
  const t = useShopT();

  return (
    <nav className="mt-10 flex items-center justify-center gap-4" aria-label="Pagination">
      {prevHref ? (
        <Link href={prevHref} className={linkClass}>
          <ChevronLeft className="h-4 w-4" />
          {t("products.prev")}
        </Link>
      ) : (
        <span className={`${linkClass} opacity-40 pointer-events-none`}>
          <ChevronLeft className="h-4 w-4" />
          {t("products.prev")}
        </span>
      )}
      <span className="text-sm text-muted-foreground">
        {t("products.page")} {page} / {totalPages}
      </span>
      {nextHref ? (
        <Link href={nextHref} className={linkClass}>
          {t("products.next")}
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : (
        <span className={`${linkClass} opacity-40 pointer-events-none`}>
          {t("products.next")}
          <ChevronRight className="h-4 w-4" />
        </span>
      )}
    </nav>
  );
}
