import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sustainability",
  description:
    "Resona's commitment to sustainable fashion: eco-friendly fabrics, ethical manufacturing with fair wages, minimal packaging, and carbon-neutral shipping.",
  alternates: { canonical: "/sustainability" },
};

export default function SustainabilityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}