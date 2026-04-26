import { getAdminStats } from "@/actions/admin";
import { DashboardContent } from "@/components/admin/dashboard-content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export default async function AdminDashboardPage() {
  const stats = await getAdminStats();
  return <DashboardContent stats={stats} />;
}
