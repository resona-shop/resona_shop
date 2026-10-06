import { siteConfig } from "@/lib/constants";

// Transactional email through Resend's HTTP API. Sending is skipped (and
// logged) until RESEND_API_KEY and EMAIL_FROM are configured, and a failed
// send never breaks the order flow that triggered it.

interface EmailMessage {
  to: string;
  subject: string;
  html: string;
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function money(amount: number) {
  return `$${Number(amount).toFixed(2)}`;
}

function layout(heading: string, body: string) {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:24px;background:#fff8f0;font-family:Arial,Helvetica,sans-serif;color:#2d2a26;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:12px;padding:32px;">
      <p style="margin:0 0 24px;font-size:20px;font-weight:bold;letter-spacing:0.04em;">${escapeHtml(siteConfig.name)}</p>
      <h1 style="margin:0 0 16px;font-size:22px;">${escapeHtml(heading)}</h1>
      ${body}
      <p style="margin:32px 0 0;font-size:12px;color:#8a8580;">
        You can review your orders any time at
        <a href="${siteConfig.url}/account/orders" style="color:#ff6b4a;">${siteConfig.url.replace(/^https?:\/\//, "")}</a>.
      </p>
    </div>
  </body>
</html>`;
}

function paragraph(text: string) {
  return `<p style="margin:0 0 12px;font-size:15px;line-height:1.6;">${text}</p>`;
}

export interface OrderEmailData {
  order_number: string;
  total: number;
  customer_name?: string | null;
  items?: Array<{
    product_name: string;
    variant_label: string | null;
    quantity: number;
    total: number;
  }>;
  shipping_carrier?: string | null;
  tracking_number?: string | null;
}

function greeting(order: OrderEmailData) {
  return paragraph(`Hi ${escapeHtml(order.customer_name || "there")},`);
}

export function orderConfirmationEmail(order: OrderEmailData) {
  const rows = (order.items || [])
    .map(
      (item) => `<tr>
        <td style="padding:8px 0;font-size:14px;border-bottom:1px solid #f0e8e0;">
          ${escapeHtml(item.product_name)}
          ${item.variant_label ? `<br><span style="color:#8a8580;font-size:12px;">${escapeHtml(item.variant_label)}</span>` : ""}
        </td>
        <td style="padding:8px 0;font-size:14px;border-bottom:1px solid #f0e8e0;text-align:center;">&times; ${item.quantity}</td>
        <td style="padding:8px 0;font-size:14px;border-bottom:1px solid #f0e8e0;text-align:right;">${money(item.total)}</td>
      </tr>`
    )
    .join("");

  return {
    subject: `Order confirmed — ${order.order_number}`,
    html: layout(
      "Thank you for your order",
      greeting(order) +
        paragraph(
          `We've received your payment for order <strong>${escapeHtml(order.order_number)}</strong> and are getting it ready.`
        ) +
        `<table style="width:100%;border-collapse:collapse;margin:16px 0;">${rows}
          <tr>
            <td colspan="2" style="padding:12px 0 0;font-size:15px;font-weight:bold;">Total</td>
            <td style="padding:12px 0 0;font-size:15px;font-weight:bold;text-align:right;">${money(order.total)}</td>
          </tr>
        </table>` +
        paragraph("We'll email you again as soon as it ships.")
    ),
  };
}

export function orderShippedEmail(order: OrderEmailData) {
  return {
    subject: `Your order is on its way — ${order.order_number}`,
    html: layout(
      "Your order has shipped",
      greeting(order) +
        paragraph(`Order <strong>${escapeHtml(order.order_number)}</strong> is on its way.`) +
        paragraph(
          `Carrier: <strong>${escapeHtml(order.shipping_carrier || "—")}</strong><br>` +
            `Tracking number: <strong>${escapeHtml(order.tracking_number || "—")}</strong>`
        )
    ),
  };
}

export function refundApprovedEmail(order: OrderEmailData) {
  return {
    subject: `Refund approved — ${order.order_number}`,
    html: layout(
      "Your refund is on its way",
      greeting(order) +
        paragraph(
          `We've refunded <strong>${money(order.total)}</strong> for order <strong>${escapeHtml(order.order_number)}</strong> to your original payment method.`
        ) +
        paragraph("Depending on your bank, it can take 5–10 business days to appear.")
    ),
  };
}

export function refundRejectedEmail(order: OrderEmailData) {
  return {
    subject: `Update on your refund request — ${order.order_number}`,
    html: layout(
      "About your refund request",
      greeting(order) +
        paragraph(
          `We reviewed the refund request for order <strong>${escapeHtml(order.order_number)}</strong> and are unable to approve it at this time.`
        ) +
        paragraph("If you have any questions, just reply to this email and we'll help.")
    ),
  };
}

export async function sendEmail(message: EmailMessage) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    console.info(`Email not configured; skipped "${message.subject}"`);
    return { skipped: true };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [message.to],
        subject: message.subject,
        html: message.html,
      }),
    });

    if (!response.ok) {
      console.error("Email send failed:", response.status, await response.text());
      return { error: true };
    }
    return { success: true };
  } catch (error) {
    console.error("Email send failed:", error);
    return { error: true };
  }
}
