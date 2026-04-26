import { notFound } from "next/navigation";
import { getProductBySlug } from "@/actions/products";
import { getProductReviews, isInWishlist } from "@/actions/social";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductInfo } from "@/components/product/product-info";
import { ProductReviews } from "@/components/product/product-reviews";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };
  return {
    title: product.name,
    description: product.description || `Shop ${product.name} at Resona`,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const [reviews, wishlisted] = await Promise.all([
    getProductReviews(product.id),
    isInWishlist(product.id),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
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
