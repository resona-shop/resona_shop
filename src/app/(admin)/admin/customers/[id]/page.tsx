import { notFound } from "next/navigation";
import { getCustomerOrders } from "@/actions/admin";
import { CustomerDetailContent } from "@/components/admin/customer-detail-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customer Detail — Admin",
};

export default async function AdminCustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { profile, orders } = await getCustomerOrders(id);

  if (!profile) notFound();

  return <CustomerDetailContent profile={profile} orders={orders} />;
}
