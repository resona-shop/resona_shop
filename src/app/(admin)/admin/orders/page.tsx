import { getAdminOrders } from "@/actions/admin";
import { OrdersContent } from "@/components/admin/orders-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orders — Admin",
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string; sort?: string; page?: string }>;
}) {
  const params = await searchParams;
  const { orders, total, page, totalPages } = await getAdminOrders({
    status: params.status,
    search: params.q,
    sort: params.sort,
    page: params.page ? parseInt(params.page) : 1,
  });

  return (
    <OrdersContent
      orders={orders}
      total={total}
      page={page}
      totalPages={totalPages}
      currentStatus={params.status || "all"}
      currentSort={params.sort || "date-desc"}
      searchQuery={params.q}
    />
  );
}
