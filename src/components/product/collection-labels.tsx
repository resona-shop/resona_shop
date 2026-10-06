"use client";

import { useCollectionT } from "@/lib/shop-i18n";

export function CollectionName({
  slug,
  fallback,
  vi,
}: {
  slug: string;
  fallback: string;
  vi?: string | null;
}) {
  const ct = useCollectionT();
  return <>{ct.name(slug, fallback, vi)}</>;
}

export function CollectionDesc({
  slug,
  fallback,
  vi,
}: {
  slug: string;
  fallback: string | null;
  vi?: string | null;
}) {
  const ct = useCollectionT();
  const desc = ct.desc(slug, fallback, vi);
  if (!desc) return null;
  return <>{desc}</>;
}
