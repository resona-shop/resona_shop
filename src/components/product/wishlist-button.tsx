"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

export function WishlistButton({ productId }: { productId: string }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Resolved on the client so product pages can be prerendered.
  useEffect(() => {
    let cancelled = false;
    fetch(`/api/wishlist?product_id=${encodeURIComponent(productId)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled && typeof data.wishlisted === "boolean") {
          setWishlisted(data.wishlisted);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [productId]);

  async function handleToggle() {
    setLoading(true);
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId }),
      });
      const data = await res.json();
      if (data.error) return;
      setWishlisted(data.added);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={cn(
        "p-3 border rounded-lg transition-all",
        wishlisted
          ? "border-primary bg-primary/5 text-primary"
          : "border-border hover:bg-secondary/50"
      )}
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart className={cn("h-5 w-5", wishlisted && "fill-current")} />
    </button>
  );
}