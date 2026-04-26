import { getCollections } from "@/actions/products";
import Image from "next/image";
import Link from "next/link";
import { CollectionsPageHeader, CollectionsExploreLabel, CollectionsEmpty } from "@/components/product/page-headers";
import { CollectionName, CollectionDesc } from "@/components/product/collection-labels";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Collections",
};

export default async function CollectionsPage() {
  const collections = await getCollections();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <CollectionsPageHeader />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((collection) => (
          <Link
            key={collection.id}
            href={`/collections/${collection.slug}`}
            className="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-secondary/50"
          >
            {collection.image_url ? (
              <Image
                src={collection.image_url}
                alt={collection.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary/80 to-muted" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-[#FDD15E]/10 to-[#FF6B4A]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative h-full flex flex-col justify-end p-6">
              <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-medium text-white group-hover:text-[#FDD15E] transition-colors">
                <CollectionName slug={collection.slug} fallback={collection.name} />
              </h2>
              {collection.description && (
                <p className="text-sm text-white/70 mt-1">
                  <CollectionDesc slug={collection.slug} fallback={collection.description} />
                </p>
              )}
              <span className="mt-3 text-xs font-medium text-white/80 group-hover:text-[#FDD15E] transition-colors">
                <CollectionsExploreLabel />
              </span>
            </div>
          </Link>
        ))}

        {collections.length === 0 && <CollectionsEmpty />}
      </div>
    </div>
  );
}
