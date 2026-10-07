import { cache } from "react";
import { notFound } from "next/navigation";
import { getProductBySlug, getActiveProductSlugs } from "@/actions/products";
import { getProductReviews } from "@/actions/social";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductInfo } from "@/components/product/product-info";
import { ProductReviews } from "@/components/product/product-reviews";
import { siteConfig } from "@/lib/constants";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

// Prerendered, then refreshed in the background so price/stock edits land.
export const revalidate = 300;

// generateMetadata and the page both need the product; fetch it once.
const getProduct = cache((slug: string) => getProductBySlug(slug));

export async function generateStaticParams() {
  const slugs = await getActiveProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

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

  const reviews = await getProductReviews(product.id);

  const variants = product.variants || [];
  const productUrl = `${siteConfig.url}/products/${product.slug}`;

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || undefined,
    image: (product.images || []).map((img) => img.url),
    category: product.category?.name,
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: (product.currency || "USD").toUpperCase(),
      price: Number(product.base_price).toFixed(2),
      availability: variants.some((v) => v.stock_quantity > 0)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  if (reviews.length > 0) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: (
        reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      ).toFixed(1),
      reviewCount: reviews.length,
    };
    jsonLd.review = reviews.map((r) => ({
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating,
        bestRating: 5,
      },
      author: {
        "@type": "Person",
        name: r.user?.full_name || "Resona Customer",
      },
      ...(r.title ? { name: r.title } : {}),
      ...(r.body ? { reviewBody: r.body } : {}),
      ...(r.created_at ? { datePublished: r.created_at.slice(0, 10) } : {}),
    }));
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "/",
      },
      product.category
        ? {
            "@type": "ListItem",
            position: 2,
            name: product.category.name,
            item: `/products?category=${product.category.slug}`,
          }
        : {
            "@type": "ListItem",
            position: 2,
            name: "Shop All",
            item: "/products",
          },
      {
        "@type": "ListItem",
        position: 3,
        name: product.name,
      },
    ],
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <nav
        aria-label="Breadcrumb"
        className="mb-4 text-sm text-muted-foreground"
      >
        <ol className="flex items-center gap-1.5 flex-wrap">
          <li>
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="h-3.5 w-3.5" />
          </li>
          <li>
            {product.category ? (
              <Link
                href={`/products?category=${product.category.slug}`}
                className="hover:text-foreground transition-colors"
              >
                {product.category.name}
              </Link>
            ) : (
              <Link
                href="/products"
                className="hover:text-foreground transition-colors"
              >
                Shop All
              </Link>
            )}
          </li>
          <li aria-hidden="true">
            <ChevronRight className="h-3.5 w-3.5" />
          </li>
          <li aria-current="page" className="text-foreground">
            {product.name}
          </li>
        </ol>
      </nav>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <ProductGallery
          images={product.images || []}
          productName={product.name}
        />
        <ProductInfo product={product} />
      </div>
      <ProductReviews productId={product.id} initialReviews={reviews} />
    </div>
  );
}