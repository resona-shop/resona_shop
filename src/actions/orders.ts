"use server";

import { createClient, createServiceClient } from "@/lib/supabase/server";
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
    .neq("status", "pending")
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
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("addresses")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
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

  // Customers have no UPDATE rights on orders, so the transition runs with
  // the service role, scoped to this user's own refundable order.
  const service = await createServiceClient();
  const { data: updated, error } = await service
    .from("orders")
    .update({ status: "refund_requested" })
    .eq("id", orderId)
    .eq("user_id", user.id)
    .in("status", ["confirmed", "processing"])
    .select("id")
    .maybeSingle();

  if (error) return { error: error.message };
  if (!updated) return { error: "This order cannot be refunded" };
  return { success: true };
}
