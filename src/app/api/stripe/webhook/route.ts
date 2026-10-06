import { NextResponse } from "next/server";
import { getStripeServer } from "@/lib/stripe/server";
import { createServiceClient } from "@/lib/supabase/server";
import { fulfillCheckoutSession, markOrderRefunded } from "@/lib/orders";
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

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      if (session.payment_status === "paid") {
        await fulfillCheckoutSession(session);
      }
    }

    if (event.type === "checkout.session.async_payment_succeeded") {
      await fulfillCheckoutSession(event.data.object as Stripe.Checkout.Session);
    }

    if (event.type === "checkout.session.expired") {
      // Abandoned checkout: drop the placeholder order it created.
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.order_id;
      if (orderId) {
        const supabase = await createServiceClient();
        await supabase
          .from("orders")
          .delete()
          .eq("id", orderId)
          .eq("status", "pending");
      }
    }

    if (event.type === "charge.refunded") {
      const charge = event.data.object as Stripe.Charge;
      const paymentIntentId =
        typeof charge.payment_intent === "string" ? charge.payment_intent : null;

      if (paymentIntentId) {
        const supabase = await createServiceClient();
        const { data: order } = await supabase
          .from("orders")
          .select("id, status")
          .eq("stripe_payment_intent_id", paymentIntentId)
          .maybeSingle();

        if (order) {
          if (charge.amount_refunded >= charge.amount) {
            await markOrderRefunded(order.id);
          } else if (order.status !== "refunded") {
            await supabase
              .from("orders")
              .update({ status: "partially_refunded" })
              .eq("id", order.id);
          }
        }
      }
    }
  } catch (err) {
    // A 500 makes Stripe retry; every handler above is safe to run again.
    console.error("Webhook processing error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
