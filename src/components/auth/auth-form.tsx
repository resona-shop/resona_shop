"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn, signUp } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { useShopT } from "@/lib/shop-i18n";

interface AuthFormProps {
  mode: "login" | "register";
}

export function AuthForm({ mode }: AuthFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const redirectTo = searchParams.get("redirect") || "/";
  const t = useShopT();

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    formData.set("redirect", redirectTo);
    const result = mode === "login" ? await signIn(formData) : await signUp(formData);
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
          {mode === "login" ? t("auth.signInSubtitle") : t("auth.signUpSubtitle")}
        </p>
      </div>

      {message && (
        <div className="bg-accent/30 text-accent-foreground text-sm p-3 rounded-lg text-center">{message}</div>
      )}
      {error && (
        <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg text-center">{error}</div>
      )}

      <form action={handleSubmit} className="space-y-4">
        {mode === "register" && (
          <div className="space-y-2">
            <Label htmlFor="full_name">{t("auth.fullName")}</Label>
            <Input id="full_name" name="full_name" type="text" required className="bg-card" />
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="email">{t("auth.email")}</Label>
          <Input id="email" name="email" type="email" placeholder="you@example.com" required className="bg-card" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">{t("auth.password")}</Label>
          <Input id="password" name="password" type="password" placeholder="••••••••" required minLength={6} className="bg-card" />
        </div>
        {mode === "login" && (
          <div className="text-right">
            <Link href="/forgot-password" className="text-sm text-primary hover:underline">
              {t("auth.forgotPassword")}
            </Link>
          </div>
        )}
        <Button type="submit" disabled={loading} className="w-full bg-gradient-golden text-white shadow-glow-coral hover:opacity-90 transition-opacity">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === "login" ? t("auth.signIn") : t("auth.signUp")}
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        {mode === "login" ? (
          <>
            {t("auth.noAccount")}{" "}
            <Link href="/register" className="text-primary hover:underline font-medium">{t("auth.signUp")}</Link>
          </>
        ) : (
          <>
            {t("auth.hasAccount")}{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">{t("auth.signIn")}</Link>
          </>
        )}
      </p>
    </div>
  );
}
