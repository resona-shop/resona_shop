"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Review {
  id: string;
  rating: number;
  title: string | null;
  body: string | null;
  created_at: string;
  user: { full_name: string | null; avatar_url: string | null } | null;
}

interface ProductReviewsProps {
  productId: string;
  initialReviews: Review[];
}

export function ProductReviews({ productId, initialReviews }: ProductReviewsProps) {
  const [reviews, setReviews] = useState(initialReviews);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const avgRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    formData.set("rating", String(rating));

    const res = await fetch(`/api/reviews/${productId}`, {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      const data = await res.json();
      if (data.success) {
        setShowForm(false);
        window.location.reload();
      }
    }
    setSubmitting(false);
  }

  return (
    <div className="mt-12 border-t border-border pt-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-medium">Reviews</h2>
          {reviews.length > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`h-4 w-4 ${s <= Math.round(avgRating) ? "fill-[#FDD15E] text-[#FDD15E]" : "text-border"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {avgRating.toFixed(1)} ({reviews.length})
              </span>
            </div>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowForm(!showForm)}
          className="border-primary/30 hover:bg-primary/5"
        >
          Write a Review
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-card rounded-xl shadow-warm-sm p-5 mb-6 space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRating(s)}
                  onMouseEnter={() => setHoverRating(s)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  <Star
                    className={`h-6 w-6 transition-colors ${
                      s <= (hoverRating || rating)
                        ? "fill-[#FDD15E] text-[#FDD15E]"
                        : "text-border"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Title</label>
            <Input name="title" placeholder="Summary of your review" className="bg-background" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Review</label>
            <Textarea name="body" rows={3} placeholder="Share your experience..." className="bg-background" />
          </div>
          <Button
            type="submit"
            disabled={submitting}
            className="bg-gradient-golden text-white hover:opacity-90"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </Button>
        </form>
      )}

      {reviews.length === 0 && !showForm && (
        <p className="text-muted-foreground text-center py-8">
          No reviews yet. Be the first to share your experience.
        </p>
      )}

      <div className="space-y-4">
        {reviews.map((review) => {
          const initials = review.user?.full_name
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase() || "?";
          return (
            <div key={review.id} className="bg-card rounded-xl shadow-warm-sm p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{review.user?.full_name || "Anonymous"}</p>
                    <div className="flex mt-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`h-3 w-3 ${s <= review.rating ? "fill-[#FDD15E] text-[#FDD15E]" : "text-border"}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(review.created_at).toLocaleDateString()}
                </span>
              </div>
              {review.title && <p className="font-medium text-sm mt-3">{review.title}</p>}
              {review.body && <p className="text-sm text-muted-foreground mt-1">{review.body}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
