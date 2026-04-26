import { NextResponse } from "next/server";
import { getStripeServer } from "@/lib/stripe/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const { session_id } = await request.json();
    if (!session_id) {
      return NextResponse.json({ error: "No session ID" }, { status: 400 });
    }

    const supabase = await createClient();

    // Check if order already confirmed
    const { data: existing } = await supabase
      .from("orders")
      .select("id, order_number, status")
      .eq("stripe_checkout_session_id", session_id)
      .single();

    if (existing && existing.status !== "pending") {
      return NextResponse.json({ order: existing });
    }

    const stripe = getStripeServer();
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
    }

    const orderId = session.metadata?.order_id;
    if (!orderId) {
      return NextResponse.json({ error: "No order found" }, { status: 400 });
    }

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

    const subtotal = (session.amount_subtotal || 0) / 100;
    const total = (session.amount_total || 0) / 100;
    const shippingCost = (session.total_details?.amount_shipping || 0) / 100;
    const tax = (session.total_details?.amount_tax || 0) / 100;

    // Update pending order to confirmed
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .update({
        status: "confirmed",
        subtotal,
        shipping_cost: shippingCost,
        tax,
        total,
        currency: session.currency || "usd",
        shipping_address: shippingAddress,
        stripe_payment_intent_id:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : null,
      })
      .eq("id", orderId)
      .select("id, order_number, user_id")
      .single();

    if (orderError) {
      console.error("Order update error:", orderError);
      return NextResponse.json({ error: "Failed to confirm order" }, { status: 500 });
    }

    // Deduct stock
    const { data: items } = await supabase
      .from("order_items")
      .select("variant_id, quantity")
      .eq("order_id", orderId);

    if (items) {
      for (const item of items) {
        if (item.variant_id) {
          const { data: variant } = await supabase
            .from("product_variants")
            .select("stock_quantity")
            .eq("id", item.variant_id)
            .single();

          if (variant) {
            await supabase
              .from("product_variants")
              .update({
                stock_quantity: Math.max(variant.stock_quantity - item.quantity, 0),
              })
              .eq("id", item.variant_id);
          }
        }
      }
    }

    // Sync shipping address to user's saved addresses
    if (order?.user_id && shippingAddress.line1) {
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

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Confirm order error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
