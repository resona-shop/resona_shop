import { notFound } from "next/navigation";
import { getCollectionBySlug } from "@/actions/products";
import { ProductGrid } from "@/components/product/product-grid";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  if (!collection) return { title: "Collection Not Found" };
  return {
    title: collection.name,
    description: collection.description || `Shop the ${collection.name} collection`,
  };
}

export default async function CollectionDetailPage({ params }: Props) {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);

  if (!collection) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl tracking-tight">
          {collection.name}
        </h1>
        {collection.description && (
          <p className="text-muted-foreground mt-2">{collection.description}</p>
        )}
      </div>

      <ProductGrid products={collection.products || []} />
    </div>
  );
}
