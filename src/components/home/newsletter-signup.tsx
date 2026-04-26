"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";
import { useShopT } from "@/lib/shop-i18n";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const t = useShopT();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) setSubmitted(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#FF6B4A] via-[#FF8C42] to-[#FDD15E] p-8 sm:p-12 lg:p-16">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/10 -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-white/10 translate-y-1/3 -translate-x-1/4" />

          <div className="relative max-w-xl mx-auto text-center">
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl text-white">
              {t("newsletter.title")}
            </h2>
            <p className="mt-3 text-white/80 text-sm sm:text-base">
              {t("newsletter.subtitle")}
            </p>

            {submitted ? (
              <div className="mt-6 py-3 px-6 rounded-xl bg-white/20 backdrop-blur-sm text-white font-medium animate-scale-in">
                {t("newsletter.success")}
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 flex gap-2 max-w-md mx-auto">
                <Input
                  type="email"
                  placeholder={t("newsletter.placeholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/60 focus:border-white focus:ring-white/30"
                />
                <Button type="submit" className="bg-white text-[#FF6B4A] hover:bg-white/90 shrink-0 px-6">
                  <Send className="h-4 w-4" />
                  <span className="sr-only sm:not-sr-only sm:ml-2">{t("newsletter.subscribe")}</span>
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
