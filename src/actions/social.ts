"use server";

import { createClient } from "@/lib/supabase/server";

export async function getWishlist() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("wishlist_items")
    .select("*, product:products(*, images:product_images(*))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return data || [];
}

export async function toggleWishlist(productId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { data: existing } = await supabase
    .from("wishlist_items")
    .select("product_id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .single();

  if (existing) {
    await supabase
      .from("wishlist_items")
      .delete()
      .eq("user_id", user.id)
      .eq("product_id", productId);
    return { added: false };
  } else {
    await supabase
      .from("wishlist_items")
      .insert({ user_id: user.id, product_id: productId });
    return { added: true };
  }
}

export async function isInWishlist(productId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from("wishlist_items")
    .select("product_id")
    .eq("user_id", user.id)
    .eq("product_id", productId)
    .single();

  return !!data;
}

export async function getProductReviews(productId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("reviews")
    .select("*, user:profiles(full_name, avatar_url)")
    .eq("product_id", productId)
    .order("created_at", { ascending: false });
  return data || [];
}

export async function addReview(productId: string, formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const review = {
    product_id: productId,
    user_id: user.id,
    rating: parseInt(formData.get("rating") as string),
    title: (formData.get("title") as string) || null,
    body: (formData.get("body") as string) || null,
  };

  const { error } = await supabase.from("reviews").insert(review);
  if (error) return { error: error.message };
  return { success: true };
}

export async function getWishlistCount() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return 0;

  const { count } = await supabase
    .from("wishlist_items")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  return count || 0;
}
