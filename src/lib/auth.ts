import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types";

// Deduped per request: the header, user menu and pages all ask for the user.
export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

export const getCurrentProfile = cache(async () => {
  const user = await getCurrentUser();
  if (!user) return null;

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (profile as Profile) || null;
});

// Server actions are public endpoints, so every admin action checks the role
// itself instead of relying on the /admin route guard.
export async function requireAdmin() {
  const profile = await getCurrentProfile();
  if (!profile || profile.role !== "admin") {
    throw new Error("Unauthorized");
  }
  return createClient();
}

// Only allow same-site relative paths as post-login redirect targets.
export function safeRedirectPath(path: string | null | undefined) {
  if (!path || !path.startsWith("/") || path.startsWith("//") || path.includes("\\")) {
    return "/";
  }
  return path;
}
