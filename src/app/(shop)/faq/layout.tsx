import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to common questions about Resona: shipping times, return policy, sizing, payment methods, sustainability, and order tracking.",
  alternates: { canonical: "/faq" },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}