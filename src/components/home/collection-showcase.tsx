import Link from "next/link";
import Image from "next/image";
import { getCollections } from "@/actions/products";
import { CollectionHeader, CollectionShopNow } from "./section-headers";
import { CollectionName, CollectionDesc } from "@/components/product/collection-labels";

export async function CollectionShowcase() {
  const collections = await getCollections();
  const display = collections.slice(0, 4);

  if (display.length === 0) return null;

  return (
    <section className="py-16 lg:py-24 bg-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <CollectionHeader />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 auto-rows-[200px] sm:auto-rows-[280px]">
          {display.map((collection, i) => (
            <Link
              key={collection.id}
              href={`/collections/${collection.slug}`}
              className={`group relative rounded-2xl overflow-hidden ${
                i < 2 ? "row-span-2 col-span-1 lg:col-span-2 lg:row-span-2" : "col-span-1"
              }`}
            >
              {collection.image_url ? (
                <Image
                  src={collection.image_url}
                  alt={collection.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1024px) 50vw, 25vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-secondary via-secondary/80 to-muted" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-br from-[#FDD15E]/10 to-[#FF6B4A]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative h-full flex flex-col justify-end p-5 sm:p-6">
                <h3 className="font-[family-name:var(--font-playfair)] text-xl sm:text-2xl font-medium text-white group-hover:text-[#FDD15E] transition-colors">
                  <CollectionName slug={collection.slug} fallback={collection.name} />
                </h3>
                {collection.description && (
                  <p className="text-sm text-white/70 mt-1">
                    <CollectionDesc slug={collection.slug} fallback={collection.description} />
                  </p>
                )}
                <CollectionShopNow />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
