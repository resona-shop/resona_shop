import { getAnnouncement } from "@/lib/site-settings";
import { AnnouncementBarClient } from "./announcement-bar-client";

export async function AnnouncementBar() {
  const announcement = await getAnnouncement();
  if (announcement && !announcement.enabled) return null;

  return <AnnouncementBarClient text={announcement?.en || undefined} />;
}
