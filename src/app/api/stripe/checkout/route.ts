import { NextResponse } from "next/server";
import { getStripeServer } from "@/lib/stripe/server";
import { createClient } from "@/lib/supabase/server";

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

    const cartData = items.map((item) => ({
      product_id: item.product_id,
      variant_id: item.variant_id,
      name: item.name,
      variant_label: item.variant_label,
      quantity: item.quantity,
      unit_price: item.price,
    }));

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
        user_id: user?.id || "guest",
        cart_items: JSON.stringify(cartData),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
