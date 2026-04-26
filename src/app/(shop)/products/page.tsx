import { getProducts, getCategories } from "@/actions/products";
import { ProductGrid } from "@/components/product/product-grid";
import { SortSelect } from "@/components/product/sort-select";
import { ProductsPageHeader, ProductsAllLabel } from "@/components/product/page-headers";
import { CategoryLabel } from "@/components/product/category-label";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop All",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const sort = params.sort || "newest";
  const category = params.category;
  const search = params.q;

  const [{ products }, categories] = await Promise.all([
    getProducts({ sort, category, search, limit: 24 }),
    getCategories(),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
      <ProductsPageHeader search={search} />

      <div className="flex flex-wrap items-center gap-3 mb-8 pb-4 border-b border-border">
        <a
          href="/products"
          className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
            !category
              ? "bg-primary text-primary-foreground"
              : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
          }`}
        >
          <ProductsAllLabel />
        </a>
        {categories.map((cat) => (
          <a
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
              category === cat.slug
                ? "bg-primary text-primary-foreground"
                : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
            }`}
          >
            <CategoryLabel slug={cat.slug} fallback={cat.name} />
          </a>
        ))}

        <div className="ml-auto">
          <Suspense>
            <SortSelect defaultValue={sort} />
          </Suspense>
        </div>
      </div>

      <ProductGrid products={products} />
    </div>
  );
}
