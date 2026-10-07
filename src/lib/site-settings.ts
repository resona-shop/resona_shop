import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/server";
import { sanitizeContentOverrides } from "@/lib/site-content";

export interface AnnouncementSetting {
  enabled: boolean;
  en: string;
}

// Storefront copy is public data; reading it without cookies keeps pages static.
async function getSetting(key: string) {
  const supabase = createPublicClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", key)
    .maybeSingle();

  if (error || !data?.value) return null;
  return data.value as Record<string, unknown>;
}

// Returns null when nothing has been saved yet, so callers can fall back to
// the built-in copy.
export const getAnnouncement = cache(async (): Promise<AnnouncementSetting | null> => {
  const value = await getSetting("announcement");
  if (!value) return null;
  return {
    enabled: value.enabled !== false,
    en: typeof value.en === "string" ? value.en : "",
  };
});

// Admin-edited storefront copy, keyed like the built-in text it replaces.
export const getContentOverrides = cache(async () => {
  return sanitizeContentOverrides(await getSetting("content"));
});
