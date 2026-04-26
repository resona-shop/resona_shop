"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="font-[family-name:var(--font-playfair)] text-4xl text-gradient-coral mb-4">
          Oops
        </p>
        <h1 className="text-xl font-medium mb-2">Something went wrong</h1>
        <p className="text-muted-foreground mb-6 max-w-md">
          We encountered an unexpected error. Please try again.
        </p>
        <Button
          onClick={reset}
          className="bg-gradient-golden text-white hover:opacity-90"
        >
          Try Again
        </Button>
      </div>
    </div>
  );
}
