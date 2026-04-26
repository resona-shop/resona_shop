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

    const { data: existing } = await supabase
      .from("orders")
      .select("id, order_number")
      .eq("stripe_checkout_session_id", session_id)
      .single();

    if (existing) {
      return NextResponse.json({ order: existing });
    }

    const stripe = getStripeServer();
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
    }

    const userId = session.metadata?.user_id;
    const cartItemsJson = session.metadata?.cart_items;

    interface CartItem {
      product_id: string;
      variant_id: string;
      name: string;
      variant_label?: string;
      quantity: number;
      unit_price: number;
    }

    const cartItems: CartItem[] = cartItemsJson ? JSON.parse(cartItemsJson) : [];

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

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: userId && userId !== "guest" ? userId : null,
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
      .select("id, order_number")
      .single();

    if (orderError) {
      console.error("Order creation error:", orderError);
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }

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

      for (const item of cartItems) {
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

    // Sync shipping address to user's saved addresses (skip guests)
    if (userId && userId !== "guest" && shippingAddress.line1) {
      const { data: existing } = await supabase
        .from("addresses")
        .select("id")
        .eq("user_id", userId)
        .eq("line1", shippingAddress.line1)
        .eq("postal_code", shippingAddress.postal_code)
        .limit(1);

      if (!existing || existing.length === 0) {
        await supabase.from("addresses").insert({
          user_id: userId,
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
