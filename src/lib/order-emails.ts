import { createServiceClient } from "@/lib/supabase/server";
import {
  orderConfirmationEmail,
  orderShippedEmail,
  refundApprovedEmail,
  refundRejectedEmail,
  sendEmail,
  type OrderEmailData,
} from "@/lib/email";

const templates = {
  confirmation: orderConfirmationEmail,
  shipped: orderShippedEmail,
  refund_approved: refundApprovedEmail,
  refund_rejected: refundRejectedEmail,
};

/**
 * Emails the customer about an order. Never throws: a mail problem must not
 * undo or block the order change that triggered it.
 */
export async function sendOrderEmail(orderId: string, kind: keyof typeof templates) {
  try {
    const supabase = await createServiceClient();
    const { data: order } = await supabase
      .from("orders")
      .select(
        "order_number, total, customer_email, shipping_address, shipping_carrier, tracking_number, items:order_items(product_name, variant_label, quantity, total), user:profiles(email, full_name)"
      )
      .eq("id", orderId)
      .maybeSingle();

    if (!order) return;

    const user = order.user as unknown as { email?: string; full_name?: string | null } | null;
    const to = order.customer_email || user?.email;
    if (!to) return;

    const address = order.shipping_address as { full_name?: string } | null;
    const data: OrderEmailData = {
      order_number: order.order_number,
      total: Number(order.total),
      customer_name: user?.full_name || address?.full_name || null,
      items: (order.items || []).map((item) => ({
        product_name: item.product_name,
        variant_label: item.variant_label,
        quantity: item.quantity,
        total: Number(item.total),
      })),
      shipping_carrier: order.shipping_carrier,
      tracking_number: order.tracking_number,
    };

    await sendEmail({ to, ...templates[kind](data) });
  } catch (error) {
    console.error(`Order email (${kind}) failed:`, error);
  }
}
