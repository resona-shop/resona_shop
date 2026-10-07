import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Meet Resona — a Southeast Asian casual fashion brand for the confident, effortless woman. Learn about our mission, our roots, and the values behind every piece.",
  alternates: { canonical: "/about" },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}