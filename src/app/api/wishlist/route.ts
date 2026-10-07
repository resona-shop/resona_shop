import { NextResponse } from "next/server";
import { isInWishlist, toggleWishlist } from "@/actions/social";

export async function GET(request: Request) {
  const productId = new URL(request.url).searchParams.get("product_id");
  if (!productId) {
    return NextResponse.json({ error: "No product_id" }, { status: 400 });
  }
  return NextResponse.json({ wishlisted: await isInWishlist(productId) });
}

export async function POST(request: Request) {
  const { product_id } = await request.json();
  if (!product_id) {
    return NextResponse.json({ error: "No product_id" }, { status: 400 });
  }
  const result = await toggleWishlist(product_id);
  return NextResponse.json(result);
}
