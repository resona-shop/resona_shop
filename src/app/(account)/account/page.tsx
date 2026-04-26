import { getProfile } from "@/actions/auth";
import { getUserOrders, getUserAddresses } from "@/actions/orders";
import { getWishlistCount } from "@/actions/social";
import { AccountOverview } from "@/components/auth/account-overview";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account",
};

export default async function AccountPage() {
  const [profile, orders, addresses, wishlistCount] = await Promise.all([
    getProfile(),
    getUserOrders(),
    getUserAddresses(),
    getWishlistCount(),
  ]);

  return (
    <AccountOverview
      fullName={profile?.full_name || "there"}
      email={profile?.email || ""}
      orderCount={orders.length}
      addressCount={addresses.length}
      wishlistCount={wishlistCount}
      recentOrders={orders.slice(0, 3)}
    />
  );
}
