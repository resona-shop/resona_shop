import { cache } from "react";
import { notFound } from "next/navigation";
import { getProductBySlug } from "@/actions/products";
import { getProductReviews, isInWishlist } from "@/actions/social";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductInfo } from "@/components/product/product-info";
import { ProductReviews } from "@/components/product/product-reviews";
import { siteConfig } from "@/lib/constants";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

// generateMetadata and the page both need the product; fetch it once.
const getProduct = cache((slug: string) => getProductBySlug(slug));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product Not Found" };

  const description = product.description || `Shop ${product.name} at Resona`;
  const image =
    product.images?.find((img) => img.is_primary) || product.images?.[0];

  return {
    title: product.name,
    description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      title: product.name,
      description,
      url: `/products/${product.slug}`,
      images: image ? [{ url: image.url, alt: product.name }] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) notFound();

  const [reviews, wishlisted] = await Promise.all([
    getProductReviews(product.id),
    isInWishlist(product.id),
  ]);

  const variants = product.variants || [];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || undefined,
    image: (product.images || []).map((img) => img.url),
    category: product.category?.name,
    offers: {
      "@type": "Offer",
      url: `${siteConfig.url}/products/${product.slug}`,
      priceCurrency: (product.currency || "USD").toUpperCase(),
      price: Number(product.base_price).toFixed(2),
      availability: variants.some((v) => v.stock_quantity > 0)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
    ...(reviews.length > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1),
        reviewCount: reviews.length,
      },
    }),
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <ProductGallery
          images={product.images || []}
          productName={product.name}
        />
        <ProductInfo product={product} wishlisted={wishlisted} />
      </div>
      <ProductReviews productId={product.id} initialReviews={reviews} />
    </div>
  );
}
