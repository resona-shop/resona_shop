import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturedProducts } from "@/components/home/featured-products";
import { CollectionShowcase } from "@/components/home/collection-showcase";
import { BrandStory } from "@/components/home/brand-story";
import { NewsletterSignup } from "@/components/home/newsletter-signup";
import { getContentOverrides } from "@/lib/site-settings";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// Prerendered, then refreshed in the background so catalog edits land.
export const revalidate = 300;

export default async function HomePage() {
  const content = await getContentOverrides();

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <HeroSection content={content} />
        <FeaturedProducts />
        <CollectionShowcase />
        <BrandStory content={content} />
        <NewsletterSignup />
      </main>
      <Footer />
    </>
  );
}
