"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useT, useAdminLocale } from "@/lib/admin-i18n";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

interface AdminReview {
  id: string;
  rating: number;
  title: string | null;
  body: string | null;
  is_verified: boolean;
  created_at: string;
  product?: { name: string; slug: string } | null;
  user?: { full_name: string | null; email: string } | null;
}

export function ReviewsContent({
  reviews,
  onDelete,
}: {
  reviews: AdminReview[];
  onDelete: (id: string) => Promise<{ error?: string; success?: boolean }>;
}) {
  const t = useT();
  const locale = useAdminLocale((s) => s.locale);
  const router = useRouter();

  async function handleDelete(id: string) {
    if (!confirm(t("common.confirmDelete"))) return;
    const result = await onDelete(id);
    if (result.error) toast.error(result.error);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{t("reviews.title")}</h1>

      <div className="bg-card rounded-xl shadow-warm-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-4 py-3 font-medium text-muted-foreground">{t("table.product")}</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">{t("table.customer")}</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">{t("reviews.rating")}</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">{t("reviews.content")}</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">{t("table.date")}</th>
              <th className="px-4 py-3 font-medium text-muted-foreground text-right">{t("table.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.id} className="border-b border-border/50 align-top">
                <td className="px-4 py-3">
                  {review.product ? (
                    <Link
                      href={`/products/${review.product.slug}`}
                      target="_blank"
                      className="font-medium text-primary hover:underline"
                    >
                      {review.product.name}
                    </Link>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  <p>{review.user?.full_name || review.user?.email || "—"}</p>
                  {review.is_verified && (
                    <Badge variant="secondary" className="mt-1 bg-green-100 text-green-800 text-[10px]">
                      {t("reviews.verified")}
                    </Badge>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1">
                    <Star className="h-3.5 w-3.5 fill-[#FDD15E] text-[#FDD15E]" />
                    {review.rating}
                  </span>
                </td>
                <td className="px-4 py-3 max-w-md">
                  {review.title && <p className="font-medium">{review.title}</p>}
                  {review.body && (
                    <p className="text-muted-foreground whitespace-pre-wrap">{review.body}</p>
                  )}
                </td>
                <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                  {formatDate(review.created_at, locale === "zh" ? "zh-CN" : "en-US")}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleDelete(review.id)}
                    className="text-xs text-destructive hover:underline inline-flex items-center gap-1"
                  >
                    <Trash2 className="h-3 w-3" />
                    {t("common.delete")}
                  </button>
                </td>
              </tr>
            ))}
            {reviews.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  {t("reviews.empty")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
