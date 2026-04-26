"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useShopT } from "@/lib/shop-i18n";

export function HeroSection() {
  const t = useShopT();

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#FFF8F0] via-[#FFE8D6] to-[#FFD4B8]" />
      <div className="absolute top-20 right-[15%] w-72 h-72 rounded-full bg-[#FDD15E]/20 blur-3xl" />
      <div className="absolute bottom-20 left-[10%] w-96 h-96 rounded-full bg-[#FF6B4A]/10 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[#FF8C42]/8 blur-3xl" />
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
        backgroundSize: "32px 32px",
      }} />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="max-w-2xl">
          <p className="text-sm font-medium tracking-widest uppercase text-primary/80 mb-4 animate-fade-in">
            {t("hero.tagline")}
          </p>
          <h1 className="font-[family-name:var(--font-playfair)] text-5xl sm:text-6xl lg:text-7xl leading-[1.1] tracking-tight animate-slide-up">
            <span className="text-foreground">{t("hero.title1")}</span>
            <br />
            <span className="text-gradient-golden">{t("hero.title2")}</span>
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-lg leading-relaxed animate-slide-up" style={{ animationDelay: "0.1s" }}>
            {t("hero.subtitle")}
          </p>
          <div className="mt-8 flex flex-wrap gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Link href="/products">
              <Button size="lg" className="bg-gradient-golden text-white shadow-glow-coral hover:opacity-90 transition-all px-8 h-12 text-base">
                {t("hero.shopNow")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/collections/new-arrivals">
              <Button variant="outline" size="lg" className="border-primary/30 text-foreground hover:bg-primary/5 h-12 px-8 text-base">
                {t("hero.newArrivals")}
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
