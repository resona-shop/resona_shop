import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Join the Resona team — a growing Southeast Asian fashion brand looking for passionate people in fashion, sustainability, and e-commerce.",
  alternates: { canonical: "/careers" },
};

export default function CareersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}