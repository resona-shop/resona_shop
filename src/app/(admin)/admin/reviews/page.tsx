import { getAdminReviews, deleteReview } from "@/actions/admin";
import { ReviewsContent } from "@/components/admin/reviews-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Reviews — Admin",
};

export default async function AdminReviewsPage() {
  const reviews = await getAdminReviews();
  return <ReviewsContent reviews={reviews} onDelete={deleteReview} />;
}
