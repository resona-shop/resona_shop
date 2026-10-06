import { getWishlist } from "@/actions/social";
import { WishlistContent } from "@/components/auth/account-wishlist";
import type { Product } from "@/types";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wishlist",
};

export default async function WishlistPage() {
  const items = await getWishlist();
  // Products that were unpublished since being saved come back as null.
  const products = items
    .map((item) => item.product as Product | null)
    .filter((product): product is Product => !!product);

  return <WishlistContent products={products} />;
}
