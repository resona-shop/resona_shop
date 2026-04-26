"use client";

import { useCollectionT } from "@/lib/shop-i18n";

export function CollectionName({ slug, fallback }: { slug: string; fallback: string }) {
  const ct = useCollectionT();
  return <>{ct.name(slug, fallback)}</>;
}

export function CollectionDesc({ slug, fallback }: { slug: string; fallback: string | null }) {
  const ct = useCollectionT();
  const desc = ct.desc(slug, fallback);
  if (!desc) return null;
  return <>{desc}</>;
}
