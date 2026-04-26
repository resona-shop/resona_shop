"use client";

import { useState } from "react";
import { useT, useAdminLocale, getStatusLabel } from "@/lib/admin-i18n";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowLeft, CreditCard, Loader2, Check, Truck, Package,
  MapPin, DollarSign, Pencil, X,
} from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  confirmed: "bg-blue-100 text-blue-800",
  processing: "bg-indigo-100 text-indigo-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  refund_requested: "bg-orange-100 text-orange-800",
  refunded: "bg-gray-100 text-gray-800",
};

const ALL_STATUSES = [
  "pending", "confirmed", "processing", "shipped", "delivered", "cancelled", "refund_requested", "refunded",
];

interface OrderDetailProps {
  order: {
    id: string;
    order_number: string;
    created_at: string;
    updated_at: string;
    status: string;
    subtotal: number;
    shipping_cost: number;
    tax: number;
    total: number;
    currency: string;
    notes: string | null;
    shipping_carrier: string | null;
    tracking_number: string | null;
    shipped_at: string | null;
    delivered_at: string | null;
    stripe_checkout_session_id: string | null;
    stripe_payment_intent_id: string | null;
    shipping_address: Record<string, string>;
    items?: Array<{
      id: string;
      product_name: string;
      variant_label?: string;
      quantity: number;
      unit_price: number;
      total: number;
    }>;
    user?: { id?: string; full_name?: string; email?: string; phone?: string } | null;
  };
  onUpdateStatus: (status: string) => Promise<{ error?: string; success?: boolean }>;
  onUpdateNotes: (notes: string) => Promise<{ error?: string; success?: boolean }>;
  onUpdateTracking: (data: { shipping_carrier: string; tracking_number: string }) => Promise<{ error?: string; success?: boolean }>;
  onMarkDelivered: () => Promise<{ error?: string; success?: boolean }>;
  onUpdateAddress: (address: Record<string, string>) => Promise<{ error?: string; success?: boolean }>;
  onUpdateAmounts: (amounts: { subtotal: number; shipping_cost: number; tax: number; total: number }) => Promise<{ error?: string; success?: boolean }>;
  onApproveRefund?: () => Promise<{ error?: string; success?: boolean }>;
  onRejectRefund?: () => Promise<{ error?: string; success?: boolean }>;
}

export function OrderDetailContent({
  order, onUpdateStatus, onUpdateNotes, onUpdateTracking, onMarkDelivered, onUpdateAddress, onUpdateAmounts, onApproveRefund, onRejectRefund,
}: OrderDetailProps) {
  const t = useT();
  const locale = useAdminLocale((s) => s.locale);
  const shipping = order.shipping_address;

  const [notes, setNotes] = useState(order.notes || "");
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesSaved, setNotesSaved] = useState(false);

  const [carrier, setCarrier] = useState(order.shipping_carrier || "");
  const [trackingNum, setTrackingNum] = useState(order.tracking_number || "");
  const [savingTracking, setSavingTracking] = useState(false);

  const [editAddress, setEditAddress] = useState(false);
  const [addr, setAddr] = useState({ ...shipping });
  const [savingAddr, setSavingAddr] = useState(false);

  const [editAmounts, setEditAmounts] = useState(false);
  const [amounts, setAmounts] = useState({
    subtotal: order.subtotal,
    shipping_cost: order.shipping_cost,
    tax: order.tax,
    total: order.total,
  });
  const [savingAmounts, setSavingAmounts] = useState(false);
  const [refundProcessing, setRefundProcessing] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [statusValue, setStatusValue] = useState(order.status);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  function showToast(type: "success" | "error", message: string) {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  }

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString(locale === "zh" ? "zh-CN" : "en-US", {
      year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
    });

  async function handleSaveNotes() {
    setSavingNotes(true);
    await onUpdateNotes(notes);
    setSavingNotes(false);
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2000);
  }

  async function handleStatusUpdate() {
    setUpdatingStatus(true);
    const result = await onUpdateStatus(statusValue);
    setUpdatingStatus(false);
    if (result.error) {
      showToast("error", result.error);
    } else {
      showToast("success", locale === "zh" ? "状态更新成功" : "Status updated successfully");
      window.location.reload();
    }
  }

  async function handleSaveTracking() {
    setSavingTracking(true);
    await onUpdateTracking({ shipping_carrier: carrier, tracking_number: trackingNum });
    setSavingTracking(false);
    window.location.reload();
  }

  async function handleMarkDelivered() {
    await onMarkDelivered();
    window.location.reload();
  }

  async function handleSaveAddress() {
    setSavingAddr(true);
    await onUpdateAddress(addr);
    setSavingAddr(false);
    setEditAddress(false);
    window.location.reload();
  }

  async function handleSaveAmounts() {
    setSavingAmounts(true);
    await onUpdateAmounts(amounts);
    setSavingAmounts(false);
    setEditAmounts(false);
    window.location.reload();
  }

  async function handleApproveRefund() {
    if (!onApproveRefund || !confirm(t("orders.refundConfirm"))) return;
    setRefundProcessing(true);
    const result = await onApproveRefund();
    setRefundProcessing(false);
    if (result.error) {
      showToast("error", result.error);
    } else {
      showToast("success", t("orders.refundApproved"));
      window.location.reload();
    }
  }

  async function handleRejectRefund() {
    if (!onRejectRefund || !confirm(t("orders.rejectConfirm"))) return;
    setRefundProcessing(true);
    const result = await onRejectRefund();
    setRefundProcessing(false);
    if (result.error) {
      showToast("error", result.error);
    } else {
      showToast("success", t("orders.refundRejected"));
      window.location.reload();
    }
  }

  function updateAddr(key: string, value: string) {
    setAddr((prev) => ({ ...prev, [key]: value }));
  }

  function recalcTotal() {
    setAmounts((prev) => ({
      ...prev,
      total: Number(prev.subtotal) + Number(prev.shipping_cost) + Number(prev.tax),
    }));
  }

  return (
    <div className="max-w-3xl space-y-6">
      {/* Toast notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg text-sm font-medium transition-all ${
          toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
        }`}>
          {toast.message}
        </div>
      )}

      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("orders.back")}
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{order.order_number}</h1>
          <div className="flex flex-wrap gap-4 mt-1 text-xs text-muted-foreground">
            <span>{t("orders.createdAt")}: {formatDate(order.created_at)}</span>
            {order.shipped_at && <span>{t("orders.shippedAt")}: {formatDate(order.shipped_at)}</span>}
            {order.delivered_at && <span>{t("orders.deliveredAt")}: {formatDate(order.delivered_at)}</span>}
          </div>
        </div>
        <Badge variant="secondary" className={`text-sm px-3 py-1 ${STATUS_COLORS[order.status] || ""}`}>
          {getStatusLabel(order.status, locale)}
        </Badge>
      </div>

      {/* Status update */}
      <div className="bg-card rounded-xl shadow-warm-sm p-5">
        <h2 className="font-medium mb-3">{t("orders.updateStatus")}</h2>
        <div className="flex items-center gap-3">
          <select value={statusValue} onChange={(e) => setStatusValue(e.target.value)} className="h-9 rounded-md border border-input bg-background px-3 text-sm">
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>{getStatusLabel(s, locale)}</option>
            ))}
          </select>
          <Button onClick={handleStatusUpdate} disabled={updatingStatus} size="sm" className="bg-primary text-primary-foreground hover:opacity-90">
            {updatingStatus ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : null}
            {t("orders.update")}
          </Button>
        </div>
      </div>

      {/* Refund approval */}
      {order.status === "refund_requested" && onApproveRefund && onRejectRefund && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
          <h2 className="font-medium mb-2 text-orange-800">{getStatusLabel("refund_requested", locale)}</h2>
          <p className="text-sm text-orange-700 mb-4">
            {locale === "zh" ? "客户已申请退款，请审核后批准或拒绝。" : "Customer has requested a refund. Please review and approve or reject."}
          </p>
          <div className="flex items-center gap-3">
            <Button
              onClick={handleApproveRefund}
              disabled={refundProcessing}
              size="sm"
              className="bg-green-600 text-white hover:bg-green-700"
            >
              {refundProcessing ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <Check className="mr-2 h-3.5 w-3.5" />}
              {t("orders.approveRefund")}
            </Button>
            <Button
              onClick={handleRejectRefund}
              disabled={refundProcessing}
              size="sm"
              variant="outline"
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              <X className="mr-2 h-3.5 w-3.5" />
              {t("orders.rejectRefund")}
            </Button>
          </div>
        </div>
      )}

      {/* Tracking / Shipping */}
      <div className="bg-card rounded-xl shadow-warm-sm p-5">
        <h2 className="font-medium mb-3 flex items-center gap-2">
          <Truck className="h-4 w-4" />
          {t("orders.tracking")}
        </h2>

        {order.status === "shipped" || order.status === "delivered" ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">{t("orders.carrier")}</p>
                <p className="font-medium">{order.shipping_carrier || "—"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">{t("orders.trackingNumber")}</p>
                <p className="font-mono font-medium">{order.tracking_number || "—"}</p>
              </div>
            </div>
            {order.status === "shipped" && (
              <Button
                onClick={handleMarkDelivered}
                size="sm"
                className="bg-green-600 text-white hover:bg-green-700"
              >
                <Package className="mr-2 h-3.5 w-3.5" />
                {t("orders.markDelivered")}
              </Button>
            )}
          </div>
        ) : order.status === "cancelled" || order.status === "refunded" ? (
          <p className="text-sm text-muted-foreground">{t("orders.noTracking")}</p>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">{t("orders.carrier")}</Label>
                <Input
                  value={carrier}
                  onChange={(e) => setCarrier(e.target.value)}
                  placeholder={t("orders.carrierPlaceholder")}
                  className="h-8 text-sm bg-background"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">{t("orders.trackingNumber")}</Label>
                <Input
                  value={trackingNum}
                  onChange={(e) => setTrackingNum(e.target.value)}
                  placeholder={t("orders.trackingPlaceholder")}
                  className="h-8 text-sm bg-background"
                />
              </div>
            </div>
            <Button
              onClick={handleSaveTracking}
              disabled={!carrier || !trackingNum || savingTracking}
              size="sm"
              className="bg-gradient-golden text-white hover:opacity-90"
            >
              {savingTracking ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <Truck className="mr-2 h-3.5 w-3.5" />}
              {t("orders.markShipped")}
            </Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Customer */}
        <div className="bg-card rounded-xl shadow-warm-sm p-5">
          <h2 className="font-medium mb-3">{t("orders.customer")}</h2>
          <p className="text-sm font-medium">{order.user?.full_name || t("orders.guest")}</p>
          <p className="text-sm text-muted-foreground">{order.user?.email}</p>
          {order.user?.phone && <p className="text-sm text-muted-foreground">{order.user.phone}</p>}
          {order.user?.id && (
            <Link href={`/admin/customers/${order.user.id}`} className="text-xs text-primary hover:underline mt-2 inline-block">
              {t("customers.viewOrders")} →
            </Link>
          )}
        </div>

        {/* Shipping address */}
        <div className="bg-card rounded-xl shadow-warm-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              {t("orders.shipping")}
            </h2>
            <button onClick={() => setEditAddress(!editAddress)} className="text-xs text-primary hover:underline inline-flex items-center gap-1">
              {editAddress ? <X className="h-3 w-3" /> : <Pencil className="h-3 w-3" />}
              {editAddress ? "" : t("orders.editAddress")}
            </button>
          </div>
          {editAddress ? (
            <div className="space-y-2">
              <Input value={addr.full_name || ""} onChange={(e) => updateAddr("full_name", e.target.value)} placeholder="Full Name" className="h-8 text-sm bg-background" />
              <Input value={addr.line1 || ""} onChange={(e) => updateAddr("line1", e.target.value)} placeholder="Address Line 1" className="h-8 text-sm bg-background" />
              <Input value={addr.line2 || ""} onChange={(e) => updateAddr("line2", e.target.value)} placeholder="Address Line 2" className="h-8 text-sm bg-background" />
              <div className="grid grid-cols-2 gap-2">
                <Input value={addr.city || ""} onChange={(e) => updateAddr("city", e.target.value)} placeholder="City" className="h-8 text-sm bg-background" />
                <Input value={addr.state || ""} onChange={(e) => updateAddr("state", e.target.value)} placeholder="State" className="h-8 text-sm bg-background" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Input value={addr.postal_code || ""} onChange={(e) => updateAddr("postal_code", e.target.value)} placeholder="Postal Code" className="h-8 text-sm bg-background" />
                <Input value={addr.country || ""} onChange={(e) => updateAddr("country", e.target.value)} placeholder="Country" className="h-8 text-sm bg-background" />
              </div>
              <Button onClick={handleSaveAddress} disabled={savingAddr} size="sm" className="bg-gradient-golden text-white hover:opacity-90">
                {savingAddr ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <Check className="mr-2 h-3.5 w-3.5" />}
                {t("orders.saveAddress")}
              </Button>
            </div>
          ) : (
            <>
              <p className="text-sm font-medium">{shipping?.full_name}</p>
              <p className="text-sm text-muted-foreground">
                {shipping?.line1}{shipping?.line2 && `, ${shipping.line2}`}<br />
                {shipping?.city}{shipping?.state && `, ${shipping.state}`} {shipping?.postal_code}<br />
                {shipping?.country}
              </p>
            </>
          )}
        </div>
      </div>

      {/* Payment info */}
      <div className="bg-card rounded-xl shadow-warm-sm p-5">
        <h2 className="font-medium mb-3 flex items-center gap-2">
          <CreditCard className="h-4 w-4" />
          {t("orders.payment")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground">{t("orders.stripeSession")}</p>
            <p className="font-mono text-xs break-all">{order.stripe_checkout_session_id || "—"}</p>
          </div>
          <div>
            <p className="text-muted-foreground">{t("orders.paymentIntent")}</p>
            <p className="font-mono text-xs break-all">{order.stripe_payment_intent_id || "—"}</p>
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="bg-card rounded-xl shadow-warm-sm p-5">
        <h2 className="font-medium mb-3">{t("orders.items")}</h2>
        <div className="divide-y divide-border">
          {order.items?.map((item) => (
            <div key={item.id} className="flex justify-between py-3 text-sm">
              <div>
                <p className="font-medium">{item.product_name}</p>
                {item.variant_label && <p className="text-xs text-muted-foreground">{item.variant_label}</p>}
                <p className="text-xs text-muted-foreground">{t("orders.qty")}: {item.quantity} × ${Number(item.unit_price).toFixed(2)}</p>
              </div>
              <p className="font-medium">${Number(item.total).toFixed(2)}</p>
            </div>
          ))}
        </div>

        {/* Amounts */}
        <div className="border-t border-border pt-3 mt-3 space-y-1 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{t("orders.editAmounts")}</span>
            <button onClick={() => setEditAmounts(!editAmounts)} className="text-xs text-primary hover:underline inline-flex items-center gap-1">
              {editAmounts ? <X className="h-3 w-3" /> : <Pencil className="h-3 w-3" />}
            </button>
          </div>

          {editAmounts ? (
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">{t("orders.subtotal")}</span>
                <Input type="number" step="0.01" value={amounts.subtotal} onChange={(e) => { setAmounts((p) => ({ ...p, subtotal: parseFloat(e.target.value) || 0 })); }} onBlur={recalcTotal} className="h-7 w-28 text-xs text-right bg-background" />
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">{t("orders.shippingCost")}</span>
                <Input type="number" step="0.01" value={amounts.shipping_cost} onChange={(e) => { setAmounts((p) => ({ ...p, shipping_cost: parseFloat(e.target.value) || 0 })); }} onBlur={recalcTotal} className="h-7 w-28 text-xs text-right bg-background" />
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">{t("orders.tax")}</span>
                <Input type="number" step="0.01" value={amounts.tax} onChange={(e) => { setAmounts((p) => ({ ...p, tax: parseFloat(e.target.value) || 0 })); }} onBlur={recalcTotal} className="h-7 w-28 text-xs text-right bg-background" />
              </div>
              <div className="flex items-center justify-between font-medium text-base pt-2 border-t border-border">
                <span>{t("common.total")}</span>
                <span>${amounts.total.toFixed(2)}</span>
              </div>
              <Button onClick={handleSaveAmounts} disabled={savingAmounts} size="sm" className="bg-gradient-golden text-white hover:opacity-90">
                {savingAmounts ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : <DollarSign className="mr-2 h-3.5 w-3.5" />}
                {t("orders.saveAmounts")}
              </Button>
            </div>
          ) : (
            <>
              <div className="flex justify-between"><span className="text-muted-foreground">{t("orders.subtotal")}</span><span>${Number(order.subtotal).toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">{t("orders.shippingCost")}</span><span>${Number(order.shipping_cost).toFixed(2)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">{t("orders.tax")}</span><span>${Number(order.tax).toFixed(2)}</span></div>
              <div className="flex justify-between font-medium text-base pt-2 border-t border-border"><span>{t("common.total")}</span><span>${Number(order.total).toFixed(2)}</span></div>
            </>
          )}
        </div>
      </div>

      {/* Notes */}
      <div className="bg-card rounded-xl shadow-warm-sm p-5">
        <h2 className="font-medium mb-3">{t("orders.notes")}</h2>
        <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t("orders.notesPlaceholder")} rows={3} className="bg-background mb-3" />
        <Button onClick={handleSaveNotes} disabled={savingNotes} size="sm" className="bg-gradient-golden text-white hover:opacity-90">
          {savingNotes ? <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" /> : notesSaved ? <Check className="mr-2 h-3.5 w-3.5" /> : null}
          {notesSaved ? t("orders.update") : t("orders.saveNotes")}
        </Button>
      </div>
    </div>
  );
}
