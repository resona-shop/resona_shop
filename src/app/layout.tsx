import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/lib/constants";
import "./globals.css";

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
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: "Resona — Ease That Resonates",
    description: siteConfig.description,
    images: ["/resona-logo.png"],
  },
  twitter: { card: "summary_large_image" },
  title: {
    default: "Resona — Ease That Resonates",
    template: "%s | Resona",
  },
  description:
    "Southeast Asian casual fashion for the confident, effortless woman. Where warm confidence echoes.",
  keywords: [
    "women's fashion",
    "casual wear",
    "Southeast Asian fashion",
    "resort wear",
    "Resona",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <TooltipProvider>
          {children}
          <Toaster position="bottom-right" />
        </TooltipProvider>
      </body>
    </html>
  );
}
