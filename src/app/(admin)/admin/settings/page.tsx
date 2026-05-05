import { SettingsContent } from "@/components/admin/settings-content";
import { saveNavigationMenu, resetNavigationMenu } from "@/actions/admin";
import { getNavigationMenuItems } from "@/lib/navigation-menu";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings — Admin",
};

export default async function AdminSettingsPage() {
  const menuItems = await getNavigationMenuItems({ includeInactive: true });

  return (
    <SettingsContent
      stripeConnected={!!process.env.STRIPE_SECRET_KEY}
      supabaseConnected={!!process.env.NEXT_PUBLIC_SUPABASE_URL}
      menuItems={menuItems}
      onSaveNavigationMenu={saveNavigationMenu}
      onResetNavigationMenu={resetNavigationMenu}
    />
  );
}
