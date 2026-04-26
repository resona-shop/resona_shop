"use client";

import { useCategoryT } from "@/lib/shop-i18n";

export function CategoryLabel({ slug, fallback }: { slug: string; fallback: string }) {
  const ct = useCategoryT();
  return <>{ct(slug, fallback)}</>;
}
