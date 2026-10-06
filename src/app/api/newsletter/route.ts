import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase.from("newsletter_subscribers").insert({ email });

  // 23505 = already subscribed, which is a success from the visitor's side.
  if (error && error.code !== "23505") {
    console.error("Newsletter signup error:", error);
    return NextResponse.json({ error: "Could not subscribe" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
