"use client";

import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { useShopT } from "@/lib/shop-i18n";

export function Footer() {
  const t = useShopT();

  const footerLinks = {
    shop: [
      { label: t("footer.newArrivals"), href: "/collections/new-arrivals" },
      { label: t("footer.bestSellers"), href: "/collections/best-sellers" },
      { label: t("footer.shopAll"), href: "/products" },
      { label: t("footer.collections"), href: "/collections" },
    ],
    help: [
      { label: t("footer.shipping"), href: "/shipping" },
      { label: t("footer.sizeGuide"), href: "/size-guide" },
      { label: t("footer.faq"), href: "/faq" },
      { label: t("footer.contact"), href: "/contact" },
    ],
    company: [
      { label: t("footer.about"), href: "/about" },
      { label: t("footer.story"), href: "/story" },
      { label: t("footer.sustainability"), href: "/sustainability" },
      { label: t("footer.careers"), href: "/careers" },
    ],
  };

  return (
    <footer className="bg-secondary/50 mt-auto">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="font-[family-name:var(--font-playfair)] text-2xl tracking-wide text-gradient-golden">
              Resona
            </Link>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-xs">
              {t("footer.brand")}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">{t("footer.shop")}</h3>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">{t("footer.help")}</h3>
            <ul className="space-y-2">
              {footerLinks.help.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">{t("footer.company")}</h3>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-border/50" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Resona. {t("footer.rights")}</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-foreground transition-colors">{t("footer.privacy")}</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">{t("footer.terms")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
