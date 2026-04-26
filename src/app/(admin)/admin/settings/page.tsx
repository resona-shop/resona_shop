import { SettingsContent } from "@/components/admin/settings-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Settings — Admin",
};

export default function AdminSettingsPage() {
  return (
    <SettingsContent
      stripeConnected={!!process.env.STRIPE_SECRET_KEY}
      supabaseConnected={!!process.env.NEXT_PUBLIC_SUPABASE_URL}
    />
  );
}
