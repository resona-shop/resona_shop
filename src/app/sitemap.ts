import type { MetadataRoute } from "next";
import { createPublicClient } from "@/lib/supabase/server";
import { siteConfig } from "@/lib/constants";

// Rebuilt at most once an hour.
export const revalidate = 3600;

const staticPaths: Array<{ path: string; priority: number }> = [
  { path: "", priority: 1 },
  { path: "/products", priority: 0.8 },
  { path: "/collections", priority: 0.8 },
  { path: "/about", priority: 0.7 },
  { path: "/story", priority: 0.7 },
  { path: "/sustainability", priority: 0.7 },
  { path: "/faq", priority: 0.6 },
  { path: "/contact", priority: 0.6 },
  { path: "/shipping", priority: 0.6 },
  { path: "/size-guide", priority: 0.6 },
  { path: "/careers", priority: 0.5 },
  { path: "/privacy", priority: 0.3 },
  { path: "/terms", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let products: Array<{ slug: string; updated_at: string }> = [];
  let collections: Array<{ slug: string; created_at: string }> = [];

  try {
    const supabase = createPublicClient();
    const [productResult, collectionResult] = await Promise.all([
      supabase.from("products").select("slug, updated_at").eq("is_active", true),
      supabase.from("collections").select("slug, created_at").eq("is_active", true),
    ]);
    products = productResult.data || [];
    collections = collectionResult.data || [];
  } catch (error) {
    // Still serve the static pages if the catalog cannot be reached.
    console.error("Sitemap catalog lookup failed:", error);
  }

  return [
    ...staticPaths.map(({ path, priority }) => ({
      url: `${siteConfig.url}${path}`,
      changeFrequency: "weekly" as const,
      priority,
    })),
    ...products.map((product) => ({
      url: `${siteConfig.url}/products/${product.slug}`,
      lastModified: product.updated_at,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    ...collections.map((collection) => ({
      url: `${siteConfig.url}/collections/${collection.slug}`,
      lastModified: collection.created_at,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
