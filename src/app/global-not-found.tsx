import "./globals.css";
import type { Metadata } from "next";
import Link from "next/link";
import { Inter, Playfair_Display } from "next/font/google";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Page Not Found",
  description:
    "The page you are looking for does not exist or has been moved. Browse the Resona shop to find something you'll love.",
};

// Unmatched URLs bypass the app's rendering, so this page brings its own
// document shell. Metadata here is what gives 404s a real <title>.
export default function GlobalNotFound() {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex items-center justify-center px-4">
        <div className="text-center">
          <p className="font-[family-name:var(--font-playfair)] text-6xl text-gradient-golden mb-4">
            404
          </p>
          <h1 className="text-xl font-medium mb-2">Page Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
          <Link
            href="/"
            className="inline-flex h-9 items-center justify-center rounded-md bg-gradient-golden px-4 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Back to Home
          </Link>
        </div>
      </body>
    </html>
  );
}