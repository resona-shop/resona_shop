import { NextResponse } from "next/server";
import { addReview } from "@/actions/social";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ productId: string }> }
) {
  const { productId } = await params;
  const formData = await request.formData();
  const result = await addReview(productId, formData);
  return NextResponse.json(result);
}
