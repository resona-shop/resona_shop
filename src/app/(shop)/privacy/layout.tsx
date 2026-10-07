import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Resona collects, uses, and protects your personal data — our privacy policy explained in plain language.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}