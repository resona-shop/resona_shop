import { getUserOrderById } from "@/actions/orders";
import { AccountOrderDetail } from "@/components/auth/account-order-detail";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Detail",
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getUserOrderById(id);

  if (!order) {
    redirect("/account/orders");
  }

  return <AccountOrderDetail order={order} />;
}
