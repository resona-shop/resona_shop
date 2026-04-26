"use client";

import { useState } from "react";
import { updateProfile } from "@/actions/orders";
import type { Profile } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Check } from "lucide-react";

export function SettingsForm({ profile }: { profile: Profile }) {
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setSaved(false);
    const result = await updateProfile(formData);
    setLoading(false);
    if (result.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4 max-w-md">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          value={profile.email}
          disabled
          className="bg-muted"
        />
        <p className="text-xs text-muted-foreground">
          Email cannot be changed here.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="full_name">Full Name</Label>
        <Input
          id="full_name"
          name="full_name"
          defaultValue={profile.full_name || ""}
          className="bg-background"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          defaultValue={profile.phone || ""}
          className="bg-background"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="bg-gradient-golden text-white hover:opacity-90"
      >
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : saved ? (
          <Check className="mr-2 h-4 w-4" />
        ) : null}
        {saved ? "Saved!" : "Save Changes"}
      </Button>
    </form>
  );
}
