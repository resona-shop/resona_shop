import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/home/hero-section";
import { FeaturedProducts } from "@/components/home/featured-products";
import { CollectionShowcase } from "@/components/home/collection-showcase";
import { BrandStory } from "@/components/home/brand-story";
import { NewsletterSignup } from "@/components/home/newsletter-signup";

export default function HomePage() {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturedProducts />
        <CollectionShowcase />
        <BrandStory />
        <NewsletterSignup />
      </main>
      <Footer />
    </>
  );
}
