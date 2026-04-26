import { getInventory, updateStock } from "@/actions/admin";
import { InventoryContent } from "@/components/admin/inventory-content";
import { revalidatePath } from "next/cache";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inventory — Admin",
};

export default async function AdminInventoryPage() {
  const items = await getInventory();

  async function handleUpdateStock(variantId: string, quantity: number) {
    "use server";
    const result = await updateStock(variantId, quantity);
    revalidatePath("/admin/inventory");
    return result;
  }

  return <InventoryContent items={items} onUpdateStock={handleUpdateStock} />;
}
