import { NextResponse } from "next/server";
import { getStripeServer } from "@/lib/stripe/server";
import { createClient } from "@/lib/supabase/server";
import { createServiceClient } from "@/lib/supabase/server";

interface CheckoutItem {
  variant_id: string;
  quantity: number;
}

interface VariantRow {
  id: string;
  size: string;
  color: string;
  price_override: number | null;
  stock_quantity: number;
  is_active: boolean;
  product: {
    id: string;
    name: string;
    base_price: number;
    is_active: boolean;
    images: Array<{ url: string; is_primary: boolean; sort_order: number }>;
  } | null;
}

const MAX_QUANTITY = 20;

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const body = (await request.json()) as { items?: CheckoutItem[] };

    // Only ids and quantities are taken from the browser; names, prices and
    // stock always come from the database.
    const quantities = new Map<string, number>();
    for (const item of Array.isArray(body.items) ? body.items : []) {
      const quantity = Math.floor(Number(item?.quantity));
      if (typeof item?.variant_id !== "string" || !(quantity > 0)) continue;
      quantities.set(item.variant_id, (quantities.get(item.variant_id) || 0) + quantity);
    }

    if (quantities.size === 0) {
      return NextResponse.json(
        { error: "No items provided" },
        { status: 400 }
      );
    }

    const serviceSupabase = await createServiceClient();

    const { data: variantData, error: variantError } = await serviceSupabase
      .from("product_variants")
      .select(
        "id, size, color, price_override, stock_quantity, is_active, product:products(id, name, base_price, is_active, images:product_images(url, is_primary, sort_order))"
      )
      .in("id", [...quantities.keys()]);

    if (variantError) {
      console.error("Checkout variant lookup error:", variantError);
      return NextResponse.json(
        { error: "Failed to create checkout session" },
        { status: 500 }
      );
    }

    const variants = new Map(
      ((variantData || []) as unknown as VariantRow[]).map((v) => [v.id, v])
    );

    const lines: Array<{
      variant: VariantRow;
      product: NonNullable<VariantRow["product"]>;
      quantity: number;
      unitAmount: number;
      label: string;
    }> = [];
    const unavailable: string[] = [];

    for (const [variantId, quantity] of quantities) {
      const variant = variants.get(variantId);
      const product = variant?.product;
      if (!variant || !product || !variant.is_active || !product.is_active) {
        unavailable.push(variantId);
        continue;
      }
      if (quantity > MAX_QUANTITY || quantity > variant.stock_quantity) {
        unavailable.push(variantId);
        continue;
      }
      lines.push({
        variant,
        product,
        quantity,
        unitAmount: Math.round(
          Number(variant.price_override ?? product.base_price) * 100
        ),
        label: `${variant.color} / ${variant.size}`,
      });
    }

    if (unavailable.length > 0) {
      return NextResponse.json(
        {
          error: "Some items are no longer available in the requested quantity",
          code: "unavailable",
          unavailable,
        },
        { status: 409 }
      );
    }

    const lineItems = lines.map((line) => {
      const images = line.product.images || [];
      const image = images.find((img) => img.is_primary) || images[0];
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: line.product.name,
            description: line.label,
            images: image ? [image.url] : undefined,
          },
          unit_amount: line.unitAmount,
        },
        quantity: line.quantity,
      };
    });

    // Create pending order in DB so we don't hit Stripe's 500-char metadata limit
    const subtotal =
      lines.reduce((sum, line) => sum + line.unitAmount * line.quantity, 0) / 100;

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

    const { error: itemsError } = await serviceSupabase.from("order_items").insert(
      lines.map((line) => ({
        order_id: order.id,
        product_id: line.product.id,
        variant_id: line.variant.id,
        product_name: line.product.name,
        variant_label: line.label,
        quantity: line.quantity,
        unit_price: line.unitAmount / 100,
        total: (line.unitAmount * line.quantity) / 100,
      }))
    );

    if (itemsError) {
      console.error("Order items creation error:", itemsError);
      await serviceSupabase.from("orders").delete().eq("id", order.id);
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 }
      );
    }

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
