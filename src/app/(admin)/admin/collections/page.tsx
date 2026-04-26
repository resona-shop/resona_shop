import {
  getAdminCollections,
  getAdminProducts,
  getCollectionProducts,
  createCollection,
  updateCollection,
  deleteCollection,
  updateCollectionProducts,
} from "@/actions/admin";
import { CollectionsContent } from "@/components/admin/collections-content";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Collections — Admin",
};

export default async function AdminCollectionsPage() {
  const [collections, products] = await Promise.all([
    getAdminCollections(),
    getAdminProducts(),
  ]);

  const collectionProductMap: Record<string, string[]> = {};
  for (const col of collections) {
    collectionProductMap[col.id] = await getCollectionProducts(col.id);
  }

  const allProducts = products.map((p) => ({ id: p.id, name: p.name }));

  async function handleCreate(formData: FormData) {
    "use server";
    await createCollection(formData);
    redirect("/admin/collections");
  }

  async function handleUpdate(id: string, formData: FormData) {
    "use server";
    await updateCollection(id, formData);
    redirect("/admin/collections");
  }

  async function handleDelete(id: string) {
    "use server";
    await deleteCollection(id);
    redirect("/admin/collections");
  }

  async function handleAssignProducts(collectionId: string, productIds: string[]) {
    "use server";
    await updateCollectionProducts(collectionId, productIds);
    redirect("/admin/collections");
  }

  return (
    <CollectionsContent
      collections={collections}
      allProducts={allProducts}
      collectionProductMap={collectionProductMap}
      onCreate={handleCreate}
      onUpdate={handleUpdate}
      onDelete={handleDelete}
      onAssignProducts={handleAssignProducts}
    />
  );
}
