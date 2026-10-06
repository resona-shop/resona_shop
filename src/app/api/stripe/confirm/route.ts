import { NextResponse } from "next/server";
import { getStripeServer } from "@/lib/stripe/server";
import { fulfillCheckoutSession } from "@/lib/orders";

export async function POST(request: Request) {
  try {
    const { session_id } = await request.json();
    if (!session_id || typeof session_id !== "string") {
      return NextResponse.json({ error: "No session ID" }, { status: 400 });
    }

    const stripe = getStripeServer();
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
    }

    const order = await fulfillCheckoutSession(session);
    if (!order) {
      return NextResponse.json({ error: "No order found" }, { status: 400 });
    }

    return NextResponse.json({
      order: { id: order.id, order_number: order.order_number },
    });
  } catch (error) {
    console.error("Confirm order error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
