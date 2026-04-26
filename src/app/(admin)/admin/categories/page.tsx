import { getAdminCategories, createCategory, updateCategory, deleteCategory } from "@/actions/admin";
import { CategoriesContent } from "@/components/admin/categories-content";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Categories — Admin",
};

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();

  async function handleCreate(formData: FormData) {
    "use server";
    await createCategory(formData);
    redirect("/admin/categories");
  }

  async function handleUpdate(id: string, formData: FormData) {
    "use server";
    await updateCategory(id, formData);
    redirect("/admin/categories");
  }

  async function handleDelete(id: string) {
    "use server";
    await deleteCategory(id);
    redirect("/admin/categories");
  }

  return (
    <CategoriesContent
      categories={categories}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
    />
  );
}
