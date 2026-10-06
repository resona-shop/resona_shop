import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export interface AnnouncementSetting {
  enabled: boolean;
  en: string;
  vi: string;
}

// Returns null when nothing has been saved yet, so callers can fall back to
// the built-in copy.
export const getAnnouncement = cache(async (): Promise<AnnouncementSetting | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "announcement")
    .maybeSingle();

  if (error || !data?.value) return null;
  const value = data.value as Partial<AnnouncementSetting>;
  return {
    enabled: value.enabled !== false,
    en: value.en || "",
    vi: value.vi || "",
  };
});
