"use client";

import { useState } from "react";
import Link from "next/link";
import { updatePassword } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useShopT } from "@/lib/shop-i18n";

export function ResetPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const t = useShopT();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    const password = formData.get("password") as string;
    const confirm = formData.get("confirm") as string;

    if (password !== confirm) {
      setError(t("auth.passwordMismatch"));
      setLoading(false);
      return;
    }

    const result = await updatePassword(formData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto space-y-6">
      <div className="text-center space-y-2">
        <Link href="/" className="inline-block">
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl tracking-wide text-gradient-golden">Resona</h1>
        </Link>
        <p className="text-muted-foreground text-sm">
          {t("auth.resetSubtitle")}
        </p>
      </div>

      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg text-center">{error}</div>
      )}

      <form action={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="password">{t("auth.newPassword")}</Label>
          <Input id="password" name="password" type="password" placeholder="••••••••" required minLength={6} className="bg-card" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="confirm">{t("auth.confirmPassword")}</Label>
          <Input id="confirm" name="confirm" type="password" placeholder="••••••••" required minLength={6} className="bg-card" />
        </div>
        <Button type="submit" disabled={loading} className="w-full bg-gradient-golden text-white shadow-glow-coral hover:opacity-90 transition-opacity">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {t("auth.updatePassword")}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        <Link href="/login" className="text-primary hover:underline font-medium">{t("auth.backToLogin")}</Link>
      </p>
    </div>
  );
}
