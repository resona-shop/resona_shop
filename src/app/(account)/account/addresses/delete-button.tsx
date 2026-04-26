"use client";

import { deleteAddress } from "@/actions/orders";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export function DeleteAddressButton({ id }: { id: string }) {
  const router = useRouter();

  async function handleDelete() {
    await deleteAddress(id);
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      className="mt-3 text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
    >
      <Trash2 className="h-3 w-3" />
      Remove
    </button>
  );
}
