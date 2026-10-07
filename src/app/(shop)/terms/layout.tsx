import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The terms that govern your use of the Resona online store — orders, payments, shipping, returns, and intellectual property.",
  alternates: { canonical: "/terms" },
};

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}