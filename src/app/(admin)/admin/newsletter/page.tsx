import { getNewsletterSubscribers, deleteNewsletterSubscriber } from "@/actions/admin";
import { NewsletterContent } from "@/components/admin/newsletter-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Newsletter — Admin",
};

export default async function AdminNewsletterPage() {
  const subscribers = await getNewsletterSubscribers();
  return (
    <NewsletterContent
      subscribers={subscribers}
      onDelete={deleteNewsletterSubscriber}
    />
  );
}
