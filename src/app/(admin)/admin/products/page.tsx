import { getAdminProducts, deleteProduct } from "@/actions/admin";
import { ProductsContent } from "@/components/admin/products-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products — Admin",
};

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const products = await getAdminProducts(params.q);

  async function handleDelete(id: string) {
    "use server";
    await deleteProduct(id);
  }

  return (
    <ProductsContent
      products={products}
      searchQuery={params.q}
      onDelete={handleDelete}
    />
  );
}
