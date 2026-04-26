import { NextResponse } from "next/server";
import { getStripeServer } from "@/lib/stripe/server";
import { createServiceClient } from "@/lib/supabase/server";
import Stripe from "stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  const stripe = getStripeServer();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      const supabase = await createServiceClient();

      const orderId = session.metadata?.order_id;
      if (!orderId) {
        console.error("No order_id in session metadata");
        return NextResponse.json({ received: true });
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

      const total = (session.amount_total || 0) / 100;
      const subtotal = (session.amount_subtotal || 0) / 100;
      const shippingCost =
        (session.total_details?.amount_shipping || 0) / 100;
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
        .select("id, user_id")
        .single();

      if (orderError) {
        console.error("Order update error:", orderError);
        return NextResponse.json({ received: true });
      }

      // Deduct stock
      const { data: items } = await supabase
        .from("order_items")
        .select("variant_id, quantity")
        .eq("order_id", orderId);

      if (items) {
        for (const item of items) {
          if (item.variant_id) {
            await supabase.rpc("deduct_stock", {
              p_variant_id: item.variant_id,
              p_quantity: item.quantity,
            });
          }
        }
      }

      // Sync shipping address to user's saved addresses
      if (order?.user_id && shippingAddress.line1) {
        const { data: existing } = await supabase
          .from("addresses")
          .select("id")
          .eq("user_id", order.user_id)
          .eq("line1", shippingAddress.line1)
          .eq("postal_code", shippingAddress.postal_code)
          .limit(1);

        if (!existing || existing.length === 0) {
          await supabase.from("addresses").insert({
            user_id: order.user_id,
            ...shippingAddress,
            is_default: false,
          });
        }
      }
    } catch (err) {
      console.error("Webhook processing error:", err);
    }
  }

  if (event.type === "charge.refunded") {
    const charge = event.data.object as Stripe.Charge;

    try {
      const supabase = await createServiceClient();

      const paymentIntentId =
        typeof charge.payment_intent === "string"
          ? charge.payment_intent
          : null;

      if (!paymentIntentId) {
        return NextResponse.json({ received: true });
      }

      const { data: order } = await supabase
        .from("orders")
        .select("id, status")
        .eq("stripe_payment_intent_id", paymentIntentId)
        .single();

      if (!order || order.status === "refunded") {
        return NextResponse.json({ received: true });
      }

      const isFullRefund = charge.amount_refunded === charge.amount;

      await supabase
        .from("orders")
        .update({ status: isFullRefund ? "refunded" : "partially_refunded" })
        .eq("id", order.id);

      // Restore stock on full refund
      if (isFullRefund) {
        const { data: items } = await supabase
          .from("order_items")
          .select("variant_id, quantity")
          .eq("order_id", order.id);

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
                    stock_quantity: variant.stock_quantity + item.quantity,
                  })
                  .eq("id", item.variant_id);
              }
            }
          }
        }
      }
    } catch (err) {
      console.error("Refund webhook error:", err);
    }
  }

  return NextResponse.json({ received: true });
}
