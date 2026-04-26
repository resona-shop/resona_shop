"use server";

import { createClient } from "@/lib/supabase/server";
import { getStripeServer } from "@/lib/stripe/server";
import type { Order } from "@/types";

export async function getUserOrders() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data } = await supabase
    .from("orders")
    .select("*, items:order_items(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (data || []) as Order[];
}

export async function getUserOrderById(id: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("orders")
    .select("*, items:order_items(*)")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  return (data as Order) || null;
}

export async function getUserAddresses() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data } = await supabase
    .from("addresses")
    .select("*")
    .eq("user_id", user.id)
    .order("is_default", { ascending: false });

  return data || [];
}

export async function addAddress(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const address = {
    user_id: user.id,
    full_name: formData.get("full_name") as string,
    line1: formData.get("line1") as string,
    line2: (formData.get("line2") as string) || null,
    city: formData.get("city") as string,
    state: (formData.get("state") as string) || null,
    postal_code: formData.get("postal_code") as string,
    country: formData.get("country") as string,
    phone: (formData.get("phone") as string) || null,
    is_default: formData.get("is_default") === "on",
  };

  const { error } = await supabase.from("addresses").insert(address);

  if (error) return { error: error.message };
  return { success: true };
}

export async function deleteAddress(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("addresses").delete().eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const updates = {
    full_name: formData.get("full_name") as string,
    phone: (formData.get("phone") as string) || null,
  };

  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", user.id);

  if (error) return { error: error.message };
  return { success: true };
}

export async function requestRefund(orderId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };

  const { data: order } = await supabase
    .from("orders")
    .select("id, status, stripe_payment_intent_id, user_id")
    .eq("id", orderId)
    .eq("user_id", user.id)
    .single();

  if (!order) return { error: "Order not found" };

  if (!["confirmed", "processing"].includes(order.status)) {
    return { error: "This order cannot be refunded" };
  }

  if (!order.stripe_payment_intent_id) {
    return { error: "No payment found for this order" };
  }

  try {
    const stripe = getStripeServer();
    await stripe.refunds.create({
      payment_intent: order.stripe_payment_intent_id,
    });
    return { success: true };
  } catch (err) {
    console.error("Refund error:", err);
    return { error: "Failed to process refund" };
  }
}
