import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AccountNav } from "@/components/auth/account-nav";
import type { Metadata } from "next";

// Account pages are per-user. robots.txt only stops crawling; noindex stops
// indexing of URLs that are already known.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div>
              <AccountNav />
            </div>
            <div className="lg:col-span-3">{children}</div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
