import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "From golden-hour inspiration to a fashion brand that resonates — the Resona story, born under Southeast Asian skies and designed for effortless confidence.",
  alternates: { canonical: "/story" },
};

export default function StoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}