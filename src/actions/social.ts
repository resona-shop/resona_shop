"use server";

import { createClient } from "@/lib/supabase/server";
import { PAID_ORDER_STATUSES } from "@/lib/orders";

export async function getWishlist() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("wishlist_items")
    .select("*, product:products(*, images:product_images(*), variants:product_variants(*))")
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
  if (!user) return { error: "Not authenticated", code: "auth" };

  const rating = parseInt(formData.get("rating") as string, 10);
  if (!(rating >= 1 && rating <= 5)) return { error: "Invalid rating" };

  // "Verified" means this customer has a paid order containing the product.
  const { data: purchases } = await supabase
    .from("order_items")
    .select("id, order:orders!inner(status, user_id)")
    .eq("product_id", productId)
    .eq("order.user_id", user.id)
    .in("order.status", [...PAID_ORDER_STATUSES, "refunded"])
    .limit(1);

  const review = {
    product_id: productId,
    user_id: user.id,
    rating,
    title: ((formData.get("title") as string) || "").trim().slice(0, 120) || null,
    body: ((formData.get("body") as string) || "").trim().slice(0, 2000) || null,
    is_verified: (purchases?.length || 0) > 0,
  };

  const { error } = await supabase.from("reviews").insert(review);
  if (error) {
    if (error.code === "23505") {
      return { error: "Already reviewed", code: "duplicate" };
    }
    return { error: error.message };
  }
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
