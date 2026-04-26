import { NextResponse } from "next/server";
import { getStripeServer } from "@/lib/stripe/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/server";

interface CheckoutItem {
  product_id: string;
  variant_id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variant_label?: string;
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { items } = (await request.json()) as { items: CheckoutItem[] };

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: "No items provided" },
        { status: 400 }
      );
    }

    const lineItems = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.name,
          description: item.variant_label || undefined,
          images: item.image ? [item.image] : undefined,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));

    // Create pending order in DB so we don't hit Stripe's 500-char metadata limit
    const serviceSupabase = await createServiceClient();
    const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const { data: order, error: orderError } = await serviceSupabase
      .from("orders")
      .insert({
        user_id: user?.id || null,
        status: "pending",
        subtotal,
        shipping_cost: 0,
        tax: 0,
        total: subtotal,
        currency: "usd",
        shipping_address: {},
      })
      .select("id")
      .single();

    if (orderError || !order) {
      console.error("Pending order creation error:", orderError);
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 }
      );
    }

    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      variant_id: item.variant_id,
      product_name: item.name,
      variant_label: item.variant_label || null,
      quantity: item.quantity,
      unit_price: item.price,
      total: item.price * item.quantity,
    }));

    await serviceSupabase.from("order_items").insert(orderItems);

    const stripe = getStripeServer();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: lineItems,
      shipping_address_collection: {
        allowed_countries: [
          "SG",
          "MY",
          "TH",
          "ID",
          "PH",
          "VN",
          "US",
          "AU",
          "GB",
        ],
      },
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cart`,
      customer_email: user?.email || undefined,
      metadata: {
        order_id: order.id,
      },
    });

    // Store stripe session ID on the pending order
    await serviceSupabase
      .from("orders")
      .update({ stripe_checkout_session_id: session.id })
      .eq("id", order.id);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
