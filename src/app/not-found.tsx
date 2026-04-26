"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

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
