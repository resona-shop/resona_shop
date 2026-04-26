"use client";

import Image from "next/image";
import Link from "next/link";
import type { CartItem as CartItemType } from "@/types";
import { useCart } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";
import { Minus, Plus, X } from "lucide-react";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();
  const price = item.variant.price_override ?? item.product.base_price;
  const primaryImage = item.product.images?.find((img) => img.is_primary) || item.product.images?.[0];

  return (
    <div className="flex gap-4 py-4">
      {/* Image */}
      <Link
        href={`/products/${item.product.slug}`}
        className="relative w-20 h-24 rounded-lg overflow-hidden bg-secondary/50 shrink-0"
      >
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={item.product.name}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <div className="w-full h-full shimmer" />
        )}
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between gap-2">
          <Link
            href={`/products/${item.product.slug}`}
            className="text-sm font-medium hover:text-primary transition-colors line-clamp-1"
          >
            {item.product.name}
          </Link>
          <button
            onClick={() => removeItem(item.variant_id)}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors shrink-0"
            aria-label="Remove item"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-xs text-muted-foreground mt-0.5">
          {item.variant.color} / {item.variant.size}
        </p>

        <div className="flex items-center justify-between mt-3">
          {/* Quantity */}
          <div className="flex items-center border border-border rounded-md">
            <button
              onClick={() => updateQuantity(item.variant_id, item.quantity - 1)}
              className="p-1.5 hover:bg-secondary/50 transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-8 text-center text-xs font-medium">
              {item.quantity}
            </span>
            <button
              onClick={() => updateQuantity(item.variant_id, item.quantity + 1)}
              className="p-1.5 hover:bg-secondary/50 transition-colors"
              aria-label="Increase quantity"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          {/* Price */}
          <p className="text-sm font-medium">
            {formatPrice(price * item.quantity)}
          </p>
        </div>
      </div>
    </div>
  );
}
