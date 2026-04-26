import { notFound } from "next/navigation";
import {
  getAdminOrderById,
  updateOrderStatus,
  updateOrderNotes,
  updateOrderTracking,
  markOrderDelivered,
  updateOrderAddress,
  updateOrderAmounts,
  approveRefund,
  rejectRefund,
} from "@/actions/admin";
import { OrderDetailContent } from "@/components/admin/order-detail-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Detail — Admin",
};

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getAdminOrderById(id);

  if (!order) notFound();

  async function handleStatusUpdate(status: string) {
    "use server";
    return await updateOrderStatus(id, status);
  }

  async function handleUpdateNotes(notes: string) {
    "use server";
    return await updateOrderNotes(id, notes);
  }

  async function handleUpdateTracking(data: { shipping_carrier: string; tracking_number: string }) {
    "use server";
    return await updateOrderTracking(id, data);
  }

  async function handleMarkDelivered() {
    "use server";
    return await markOrderDelivered(id);
  }

  async function handleUpdateAddress(address: Record<string, string>) {
    "use server";
    return await updateOrderAddress(id, address);
  }

  async function handleUpdateAmounts(amounts: { subtotal: number; shipping_cost: number; tax: number; total: number }) {
    "use server";
    return await updateOrderAmounts(id, amounts);
  }

  async function handleApproveRefund() {
    "use server";
    return await approveRefund(id);
  }

  async function handleRejectRefund() {
    "use server";
    return await rejectRefund(id);
  }

  return (
    <OrderDetailContent
      order={order}
      onUpdateStatus={handleStatusUpdate}
      onUpdateNotes={handleUpdateNotes}
      onUpdateTracking={handleUpdateTracking}
      onMarkDelivered={handleMarkDelivered}
      onUpdateAddress={handleUpdateAddress}
      onUpdateAmounts={handleUpdateAmounts}
      onApproveRefund={handleApproveRefund}
      onRejectRefund={handleRejectRefund}
    />
  );
}
