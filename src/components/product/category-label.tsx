"use client";

import { useCategoryT } from "@/lib/shop-i18n";

export function CategoryLabel({
  slug,
  fallback,
  vi,
}: {
  slug: string;
  fallback: string;
  vi?: string | null;
}) {
  const ct = useCategoryT();
  return <>{ct(slug, fallback, vi)}</>;
}
