import type { MetadataRoute } from "next";
import { createPublicClient } from "@/lib/supabase/server";
import { siteConfig } from "@/lib/constants";

// Rebuilt at most once an hour.
export const revalidate = 3600;

const staticPaths = [
  "",
  "/products",
  "/collections",
  "/about",
  "/story",
  "/sustainability",
  "/careers",
  "/faq",
  "/contact",
  "/shipping",
  "/size-guide",
  "/privacy",
  "/terms",
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
    ...staticPaths.map((path) => ({
      url: `${siteConfig.url}${path}`,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.5,
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
