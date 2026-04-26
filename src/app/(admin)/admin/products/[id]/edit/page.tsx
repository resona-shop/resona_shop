import { notFound } from "next/navigation";
import { updateProduct } from "@/actions/admin";
import { getCategories } from "@/actions/products";
import { createClient } from "@/lib/supabase/server";
import { ProductForm } from "@/components/admin/product-form";
import { EditProductTitle } from "@/components/admin/product-titles";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Product — Admin",
};

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("*, category:categories(*), images:product_images(*), variants:product_variants(*)")
    .eq("id", id)
    .single();

  if (!product) notFound();

  const categories = await getCategories();

  async function handleUpdate(formData: FormData) {
    "use server";
    return updateProduct(id, formData);
  }

  return (
    <div className="max-w-2xl space-y-6">
      <EditProductTitle />
      <div className="bg-card rounded-xl shadow-warm-sm p-6">
        <ProductForm
          categories={categories}
          product={product}
          action={handleUpdate}
        />
      </div>
    </div>
  );
}
