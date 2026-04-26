import { getProfile } from "@/actions/auth";
import { SettingsForm } from "./settings-form";
import { AccountSettingsContent } from "@/components/auth/account-settings";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account Settings",
};

export default async function SettingsPage() {
  const profile = await getProfile();

  if (!profile) {
    return <p className="text-muted-foreground">Unable to load profile.</p>;
  }

  return (
    <AccountSettingsContent>
      <SettingsForm profile={profile} />
    </AccountSettingsContent>
  );
}
