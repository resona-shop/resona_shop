import { NextResponse } from "next/server";
import { toggleWishlist } from "@/actions/social";

export async function POST(request: Request) {
  const { product_id } = await request.json();
  if (!product_id) {
    return NextResponse.json({ error: "No product_id" }, { status: 400 });
  }
  const result = await toggleWishlist(product_id);
  return NextResponse.json(result);
}
