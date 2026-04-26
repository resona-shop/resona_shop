import { getAdminCustomers } from "@/actions/admin";
import { CustomersContent } from "@/components/admin/customers-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Customers — Admin",
};

export default async function AdminCustomersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const customers = await getAdminCustomers(params.q);
  return <CustomersContent customers={customers} searchQuery={params.q} />;
}
