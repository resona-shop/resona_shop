// Pure checkout rules, kept free of I/O so they can be unit tested.

export const MAX_QUANTITY_PER_ITEM = 20;

export interface CheckoutVariant {
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
    images?: Array<{ url: string; is_primary: boolean; sort_order: number }>;
  } | null;
}

export interface CheckoutLine {
  variant: CheckoutVariant;
  product: NonNullable<CheckoutVariant["product"]>;
  quantity: number;
  /** Unit price in cents. */
  unitAmount: number;
  label: string;
}

/**
 * Reads the cart sent by the browser. Only variant ids and quantities are
 * trusted; anything else in the payload is ignored.
 */
export function parseCheckoutItems(items: unknown) {
  const quantities = new Map<string, number>();
  if (!Array.isArray(items)) return quantities;

  for (const item of items) {
    const variantId = (item as { variant_id?: unknown } | null)?.variant_id;
    const quantity = Math.floor(Number((item as { quantity?: unknown } | null)?.quantity));
    if (typeof variantId !== "string" || !variantId || !(quantity > 0)) continue;
    quantities.set(variantId, (quantities.get(variantId) || 0) + quantity);
  }

  return quantities;
}

/**
 * Prices the cart from database rows and reports every variant that cannot
 * be bought in the requested quantity.
 */
export function resolveCheckoutLines(
  quantities: Map<string, number>,
  variants: CheckoutVariant[]
) {
  const byId = new Map(variants.map((variant) => [variant.id, variant]));
  const lines: CheckoutLine[] = [];
  const unavailable: string[] = [];

  for (const [variantId, quantity] of quantities) {
    const variant = byId.get(variantId);
    const product = variant?.product;

    if (
      !variant ||
      !product ||
      !variant.is_active ||
      !product.is_active ||
      quantity > MAX_QUANTITY_PER_ITEM ||
      quantity > variant.stock_quantity
    ) {
      unavailable.push(variantId);
      continue;
    }

    lines.push({
      variant,
      product,
      quantity,
      unitAmount: Math.round(Number(variant.price_override ?? product.base_price) * 100),
      label: `${variant.color} / ${variant.size}`,
    });
  }

  return { lines, unavailable };
}

/** Cart total in cents. */
export function sumCheckoutLines(lines: CheckoutLine[]) {
  return lines.reduce((sum, line) => sum + line.unitAmount * line.quantity, 0);
}
