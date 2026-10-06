import { getAdminProductsPage, deleteProduct } from "@/actions/admin";
import { ProductsContent } from "@/components/admin/products-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products — Admin",
};

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const params = await searchParams;
  const { products, page, totalPages } = await getAdminProductsPage({
    search: params.q,
    page: params.page ? parseInt(params.page, 10) : 1,
  });

  async function handleDelete(id: string) {
    "use server";
    return deleteProduct(id);
  }

  return (
    <ProductsContent
      products={products}
      searchQuery={params.q}
      page={page}
      totalPages={totalPages}
      onDelete={handleDelete}
    />
  );
}
