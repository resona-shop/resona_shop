import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Size Guide",
  description:
    "Find your perfect fit with the Resona size guide — bust, waist, and hip measurements for sizes XS to XL, in centimeters.",
  alternates: { canonical: "/size-guide" },
};

export default function SizeGuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}