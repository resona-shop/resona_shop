import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";

// Rendered by notFound() inside a route segment (e.g. a stale product slug),
// so it needs its own title instead of inheriting the home page default.
export const metadata: Metadata = {
  title: "Page Not Found",
  description:
    "The page you are looking for does not exist or has been moved. Browse the Resona shop to find something you'll love.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="font-[family-name:var(--font-playfair)] text-6xl text-gradient-golden mb-4">
          404
        </p>
        <h1 className="text-xl font-medium mb-2">Page Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link href="/">
          <Button className="bg-gradient-golden text-white hover:opacity-90">
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
