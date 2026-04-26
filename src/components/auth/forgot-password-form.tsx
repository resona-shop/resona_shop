"use client";

import { useState } from "react";
import Link from "next/link";
import { resetPassword } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useShopT } from "@/lib/shop-i18n";

export function ForgotPasswordForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const t = useShopT();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const result = await resetPassword(formData);
    if (result?.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  }

  return (
    <div className="w-full max-w-sm mx-auto space-y-6">
      <div className="text-center space-y-2">
        <Link href="/" className="inline-block">
          <h1 className="font-[family-name:var(--font-playfair)] text-3xl tracking-wide text-gradient-golden">Resona</h1>
        </Link>
        <p className="text-muted-foreground text-sm">
          {t("auth.forgotSubtitle")}
        </p>
      </div>

      {success ? (
        <div className="space-y-4">
          <div className="bg-accent/30 text-accent-foreground text-sm p-3 rounded-lg text-center">
            {t("auth.resetSent")}
          </div>
          <Link href="/login" className="block">
            <Button variant="outline" className="w-full">{t("auth.backToLogin")}</Button>
          </Link>
        </div>
      ) : (
        <>
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg text-center">{error}</div>
          )}
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("auth.email")}</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required className="bg-card" />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-gradient-golden text-white shadow-glow-coral hover:opacity-90 transition-opacity">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("auth.sendResetLink")}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground">
            <Link href="/login" className="text-primary hover:underline font-medium">{t("auth.backToLogin")}</Link>
          </p>
        </>
      )}
    </div>
  );
}
