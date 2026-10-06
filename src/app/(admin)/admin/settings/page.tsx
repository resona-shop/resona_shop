import { SettingsContent } from "@/components/admin/settings-content";
import { saveNavigationMenu, resetNavigationMenu, saveAnnouncement, saveSiteContent } from "@/actions/admin";
import { getNavigationMenuItems, staticStorefrontLinks } from "@/lib/navigation-menu";
import { getAnnouncement, getContentOverrides } from "@/lib/site-settings";
import { getCategories, getCollections } from "@/actions/products";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings — Admin",
};

export default async function AdminSettingsPage() {
  const [menuItems, announcement, content, categories, collections] = await Promise.all([
    getNavigationMenuItems({ includeInactive: true }),
    getAnnouncement(),
    getContentOverrides(),
    getCategories(),
    getCollections(),
  ]);

  // Every link the storefront can actually serve, for suggestions + validation.
  const linkOptions = [
    ...staticStorefrontLinks,
    ...collections.map((c) => ({ label: c.name, href: `/collections/${c.slug}` })),
    ...categories.map((c) => ({ label: c.name, href: `/products?category=${c.slug}` })),
  ];

  return (
    <SettingsContent
      stripeConnected={!!process.env.STRIPE_SECRET_KEY}
      supabaseConnected={!!process.env.NEXT_PUBLIC_SUPABASE_URL}
      menuItems={menuItems}
      linkOptions={linkOptions}
      announcement={announcement || { enabled: true, en: "" }}
      content={content}
      onSaveContent={saveSiteContent}
      onSaveNavigationMenu={saveNavigationMenu}
      onResetNavigationMenu={resetNavigationMenu}
      onSaveAnnouncement={saveAnnouncement}
    />
  );
}
