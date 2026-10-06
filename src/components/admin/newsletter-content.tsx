"use client";

import { useRouter } from "next/navigation";
import { Download, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useT, useAdminLocale } from "@/lib/admin-i18n";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";

interface Subscriber {
  id: string;
  email: string;
  created_at: string;
}

export function NewsletterContent({
  subscribers,
  onDelete,
}: {
  subscribers: Subscriber[];
  onDelete: (id: string) => Promise<{ error?: string; success?: boolean }>;
}) {
  const t = useT();
  const locale = useAdminLocale((s) => s.locale);
  const router = useRouter();

  function handleExport() {
    const rows = [
      "email,subscribed_at",
      ...subscribers.map((s) => `${s.email},${s.created_at}`),
    ];
    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "newsletter-subscribers.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  async function handleDelete(id: string) {
    if (!confirm(t("common.confirmDelete"))) return;
    const result = await onDelete(id);
    if (result.error) toast.error(result.error);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          {t("newsletter.title")}{" "}
          <span className="text-base font-normal text-muted-foreground">({subscribers.length})</span>
        </h1>
        <Button variant="outline" onClick={handleExport} disabled={subscribers.length === 0}>
          <Download className="h-4 w-4" />
          {t("newsletter.export")}
        </Button>
      </div>

      <div className="bg-card rounded-xl shadow-warm-sm overflow-hidden max-w-2xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-4 py-3 font-medium text-muted-foreground">{t("newsletter.email")}</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">{t("newsletter.subscribedAt")}</th>
              <th className="px-4 py-3 font-medium text-muted-foreground text-right">{t("table.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {subscribers.map((subscriber) => (
              <tr key={subscriber.id} className="border-b border-border/50">
                <td className="px-4 py-3 font-medium">{subscriber.email}</td>
                <td className="px-4 py-3 text-muted-foreground">
                  {formatDate(subscriber.created_at, locale === "zh" ? "zh-CN" : "en-US")}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleDelete(subscriber.id)}
                    className="text-xs text-destructive hover:underline inline-flex items-center gap-1"
                  >
                    <Trash2 className="h-3 w-3" />
                    {t("common.delete")}
                  </button>
                </td>
              </tr>
            ))}
            {subscribers.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
                  {t("newsletter.empty")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
