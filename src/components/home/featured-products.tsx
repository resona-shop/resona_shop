import { getProducts } from "@/actions/products";
import { ProductCard } from "@/components/product/product-card";
import { FeaturedHeader, FeaturedFooter } from "./section-headers";

export async function FeaturedProducts() {
  const { products } = await getProducts({ featured: true, limit: 4 });

  if (products.length === 0) return null;

  return (
    <section className="py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <FeaturedHeader />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <FeaturedFooter />
      </div>
    </section>
  );
}
