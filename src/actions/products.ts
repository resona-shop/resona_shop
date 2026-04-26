"use server";

import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/types";

export async function getProducts(options?: {
  category?: string;
  collection?: string;
  featured?: boolean;
  search?: string;
  sort?: string;
  limit?: number;
  offset?: number;
}) {
  const supabase = await createClient();
  let query = supabase
    .from("products")
    .select(
      `*,
      category:categories(*),
      images:product_images(*),
      variants:product_variants(*)`,
      { count: "exact" }
    )
    .eq("is_active", true);

  if (options?.featured) {
    query = query.eq("is_featured", true);
  }

  if (options?.category) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", options.category)
      .single();
    if (cat) {
      query = query.eq("category_id", cat.id);
    } else {
      return { products: [] as Product[], count: 0 };
    }
  }

  if (options?.search) {
    query = query.ilike("name", `%${options.search}%`);
  }

  switch (options?.sort) {
    case "price-asc":
      query = query.order("base_price", { ascending: true });
      break;
    case "price-desc":
      query = query.order("base_price", { ascending: false });
      break;
    case "newest":
      query = query.order("created_at", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset) {
    query = query.range(
      options.offset,
      options.offset + (options.limit || 12) - 1
    );
  }

  const { data, count, error } = await query;

  if (error) {
    return { products: [] as Product[], count: 0 };
  }

  return { products: (data || []) as Product[], count: count || 0 };
}

export async function getProductBySlug(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      `*,
      category:categories(*),
      images:product_images(*),
      variants:product_variants(*),
      reviews(*, user:profiles(id, full_name, avatar_url))`
    )
    .eq("slug", slug)
    .single();

  if (error) return null;
  return data as Product;
}

export async function getCategories() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");
  return data || [];
}

export async function getCollections() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("collections")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");
  return data || [];
}

export async function getCollectionBySlug(slug: string) {
  const supabase = await createClient();

  const { data: collection } = await supabase
    .from("collections")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!collection) return null;

  const { data: productLinks } = await supabase
    .from("product_collections")
    .select("product_id")
    .eq("collection_id", collection.id);

  const productIds = (productLinks || []).map((l) => l.product_id);

  if (productIds.length === 0) {
    return { ...collection, products: [] };
  }

  const { data: products } = await supabase
    .from("products")
    .select(`*, images:product_images(*), variants:product_variants(*)`)
    .in("id", productIds)
    .eq("is_active", true);

  return { ...collection, products: products || [] };
}
