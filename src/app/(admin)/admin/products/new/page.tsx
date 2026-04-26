import { createProduct } from "@/actions/admin";
import { getCategories } from "@/actions/products";
import { ProductForm } from "@/components/admin/product-form";
import { NewProductTitle } from "@/components/admin/product-titles";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New Product — Admin",
};

export default async function NewProductPage() {
  const categories = await getCategories();

  return (
    <div className="max-w-2xl space-y-6">
      <NewProductTitle />
      <div className="bg-card rounded-xl shadow-warm-sm p-6">
        <ProductForm categories={categories} action={createProduct} />
      </div>
    </div>
  );
}
