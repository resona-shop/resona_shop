import { getProducts, getCategories } from "@/actions/products";
import { ProductGrid } from "@/components/product/product-grid";
import { SortSelect } from "@/components/product/sort-select";
import { ProductsPageHeader, ProductsAllLabel } from "@/components/product/page-headers";
import { CategoryLabel } from "@/components/product/category-label";
import { ProductsPagination } from "@/components/product/products-pagination";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop All",
};

const PER_PAGE = 24;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const sort = params.sort || "newest";
  const category = params.category;
  const search = params.q;
  const page = Math.max(parseInt(params.page || "1", 10) || 1, 1);

  const [{ products, count }, categories] = await Promise.all([
    getProducts({
      sort,
      category,
      search,
      limit: PER_PAGE,
      offset: (page - 1) * PER_PAGE,
    }),
    getCategories(),
  ]);

  const totalPages = Math.max(Math.ceil(count / PER_PAGE), 1);

  function pageHref(target: number) {
    const query = new URLSearchParams();
    if (category) query.set("category", category);
    if (search) query.set("q", search);
    if (sort !== "newest") query.set("sort", sort);
    if (target > 1) query.set("page", String(target));
    const qs = query.toString();
    return `/products${qs ? `?${qs}` : ""}`;
  }

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
            <CategoryLabel slug={cat.slug} fallback={cat.name} vi={cat.name_vi} />
          </a>
        ))}

        <div className="ml-auto">
          <Suspense>
            <SortSelect defaultValue={sort} />
          </Suspense>
        </div>
      </div>

      <ProductGrid products={products} />

      {totalPages > 1 && (
        <ProductsPagination
          page={page}
          totalPages={totalPages}
          prevHref={page > 1 ? pageHref(page - 1) : null}
          nextHref={page < totalPages ? pageHref(page + 1) : null}
        />
      )}
    </div>
  );
}
