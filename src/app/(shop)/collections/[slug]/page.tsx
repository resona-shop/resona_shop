import { notFound } from "next/navigation";
import { getCollectionBySlug, getActiveCollectionSlugs } from "@/actions/products";
import { ProductGrid } from "@/components/product/product-grid";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

// Prerendered, then refreshed in the background so catalog edits land.
export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getActiveCollectionSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  if (!collection) return { title: "Collection Not Found" };
  const description =
    collection.description || `Shop the ${collection.name} collection`;
  const ogImage = collection.image_url
    ? { images: [{ url: collection.image_url, alt: collection.name }] }
    : {};
  return {
    title: collection.name,
    description,
    alternates: { canonical: `/collections/${collection.slug}` },
    openGraph: {
      title: collection.name,
      description,
      url: `/collections/${collection.slug}`,
      type: "website",
      ...ogImage,
    },
  };
}

export default async function CollectionDetailPage({ params }: Props) {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);

  if (!collection) notFound();

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
      {
        "@type": "ListItem",
        position: 2,
        name: "Collections",
        item: "/collections",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: collection.name,
      },
    ],
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
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
            <Link
              href="/collections"
              className="hover:text-foreground transition-colors"
            >
              Collections
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="h-3.5 w-3.5" />
          </li>
          <li aria-current="page" className="text-foreground">
            {collection.name}
          </li>
        </ol>
      </nav>
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl tracking-tight">
          {collection.name}
        </h1>
        {collection.description && (
          <p className="text-muted-foreground mt-2">
            {collection.description}
          </p>
        )}
      </div>

      <ProductGrid products={collection.products || []} />
    </div>
  );
}
