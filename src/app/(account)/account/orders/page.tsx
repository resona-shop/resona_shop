import { getUserOrders } from "@/actions/orders";
import { AccountOrdersContent } from "@/components/auth/account-orders";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Orders",
};

export default async function OrdersPage() {
  const orders = await getUserOrders();
  return <AccountOrdersContent orders={orders} />;
}
