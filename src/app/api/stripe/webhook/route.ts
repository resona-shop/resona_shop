import { NextResponse } from "next/server";
import { getStripeServer } from "@/lib/stripe/server";
import { createServiceClient } from "@/lib/supabase/server";
import Stripe from "stripe";

interface CartItem {
  product_id: string;
  variant_id: string;
  name: string;
  variant_label?: string;
  quantity: number;
  unit_price: number;
}

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

      const userId = session.metadata?.user_id;
      const cartItemsJson = session.metadata?.cart_items;
      const cartItems: CartItem[] = cartItemsJson
        ? JSON.parse(cartItemsJson)
        : [];

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
      const shippingCost =
        (session.total_details?.amount_shipping || 0) / 100;
      const tax = (session.total_details?.amount_tax || 0) / 100;

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: userId !== "guest" ? userId : null,
          status: "confirmed",
          subtotal,
          shipping_cost: shippingCost,
          tax,
          total,
          currency: session.currency || "usd",
          shipping_address: shippingAddress,
          stripe_checkout_session_id: session.id,
          stripe_payment_intent_id:
            typeof session.payment_intent === "string"
              ? session.payment_intent
              : null,
        })
        .select("id")
        .single();

      if (orderError) {
        console.error("Order creation error:", orderError);
        return NextResponse.json({ received: true });
      }

      // Create order items with real product/variant IDs
      if (order && cartItems.length > 0) {
        const orderItems = cartItems.map((item) => ({
          order_id: order.id,
          product_id: item.product_id,
          variant_id: item.variant_id,
          product_name: item.name,
          variant_label: item.variant_label || null,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total: item.unit_price * item.quantity,
        }));

        await supabase.from("order_items").insert(orderItems);

        // Deduct stock for each variant
        for (const item of cartItems) {
          if (item.variant_id) {
            await supabase.rpc("deduct_stock", {
              p_variant_id: item.variant_id,
              p_quantity: item.quantity,
            });
          }
        }
      }
    } catch (err) {
      console.error("Webhook processing error:", err);
    }
  }

  return NextResponse.json({ received: true });
}
