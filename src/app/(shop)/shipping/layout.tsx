import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping & Returns",
  description:
    "Resona ships across Southeast Asia and worldwide. Free standard shipping on orders over $80, a 30-day return policy, and easy exchanges.",
  alternates: { canonical: "/shipping" },
};

export default function ShippingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}