import type Stripe from "stripe";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createServiceClient } from "@/lib/supabase/server";

// Statuses that represent money actually received.
export const PAID_ORDER_STATUSES = [
  "confirmed",
  "processing",
  "shipped",
  "delivered",
  "refund_requested",
  "partially_refunded",
] as const;

async function adjustOrderStock(
  supabase: SupabaseClient,
  orderId: string,
  direction: 1 | -1
) {
  const { data: items } = await supabase
    .from("order_items")
    .select("variant_id, quantity")
    .eq("order_id", orderId);

  for (const item of items || []) {
    if (!item.variant_id) continue;
    await supabase.rpc("adjust_stock", {
      p_variant_id: item.variant_id,
      p_delta: direction * item.quantity,
    });
  }
}

/**
 * Marks the pending order behind a paid Checkout Session as confirmed.
 * Called by both the Stripe webhook and the success page; the status guard
 * makes sure stock is only deducted once no matter who gets there first.
 */
export async function fulfillCheckoutSession(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.order_id;
  if (!orderId) return null;

  const supabase = await createServiceClient();

  const shipping = session.collected_information?.shipping_details;
  const shippingAddress = {
    full_name: shipping?.name || "",
    line1: shipping?.address?.line1 || "",
    line2: shipping?.address?.line2 || "",
    city: shipping?.address?.city || "",
    state: shipping?.address?.state || "",
    postal_code: shipping?.address?.postal_code || "",
    country: shipping?.address?.country || "",
  };

  const { data: order, error } = await supabase
    .from("orders")
    .update({
      status: "confirmed",
      subtotal: (session.amount_subtotal || 0) / 100,
      shipping_cost: (session.total_details?.amount_shipping || 0) / 100,
      tax: (session.total_details?.amount_tax || 0) / 100,
      total: (session.amount_total || 0) / 100,
      currency: session.currency || "usd",
      shipping_address: shippingAddress,
      stripe_payment_intent_id:
        typeof session.payment_intent === "string" ? session.payment_intent : null,
    })
    .eq("id", orderId)
    .eq("status", "pending")
    .select("id, order_number, user_id")
    .maybeSingle();

  if (error) throw error;

  if (!order) {
    // Already fulfilled by the other caller.
    const { data: existing } = await supabase
      .from("orders")
      .select("id, order_number, user_id")
      .eq("id", orderId)
      .maybeSingle();
    return existing;
  }

  await adjustOrderStock(supabase, orderId, -1);

  // Sync shipping address to user's saved addresses
  if (order.user_id && shippingAddress.line1) {
    const { data: existingAddr } = await supabase
      .from("addresses")
      .select("id")
      .eq("user_id", order.user_id)
      .eq("line1", shippingAddress.line1)
      .eq("postal_code", shippingAddress.postal_code)
      .limit(1);

    if (!existingAddr || existingAddr.length === 0) {
      await supabase.from("addresses").insert({
        user_id: order.user_id,
        ...shippingAddress,
        is_default: false,
      });
    }
  }

  return order;
}

/**
 * Flips an order to refunded and puts its items back in stock. Whoever makes
 * the status transition (admin approval or the Stripe webhook) restores stock,
 * so it happens exactly once.
 */
export async function markOrderRefunded(orderId: string) {
  const supabase = await createServiceClient();

  const { data: order, error } = await supabase
    .from("orders")
    .update({ status: "refunded" })
    .eq("id", orderId)
    .neq("status", "refunded")
    .select("id")
    .maybeSingle();

  if (error) throw error;
  if (order) await adjustOrderStock(supabase, orderId, 1);
}
