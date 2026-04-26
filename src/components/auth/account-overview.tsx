"use client";

import { useShopT } from "@/lib/shop-i18n";
import { Package, MapPin, Heart } from "lucide-react";
import Link from "next/link";

interface AccountOverviewProps {
  fullName: string;
  email: string;
  orderCount: number;
  addressCount: number;
  wishlistCount: number;
  recentOrders: Array<{
    id: string;
    order_number: string;
    created_at: string;
    total: number;
    status: string;
  }>;
}

export function AccountOverview({
  fullName, email, orderCount, addressCount, wishlistCount, recentOrders,
}: AccountOverviewProps) {
  const t = useShopT();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-medium">
          {t("account.welcome")} {fullName}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">{email}</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/account/orders" className="bg-card rounded-xl shadow-warm-sm p-5 hover:shadow-warm transition-shadow">
          <Package className="h-5 w-5 text-primary mb-2" />
          <p className="text-2xl font-medium">{orderCount}</p>
          <p className="text-sm text-muted-foreground">{t("account.orders")}</p>
        </Link>
        <Link href="/account/addresses" className="bg-card rounded-xl shadow-warm-sm p-5 hover:shadow-warm transition-shadow">
          <MapPin className="h-5 w-5 text-primary mb-2" />
          <p className="text-2xl font-medium">{addressCount}</p>
          <p className="text-sm text-muted-foreground">{t("account.addresses")}</p>
        </Link>
        <div className="bg-card rounded-xl shadow-warm-sm p-5">
          <Heart className="h-5 w-5 text-primary mb-2" />
          <p className="text-2xl font-medium">{wishlistCount}</p>
          <p className="text-sm text-muted-foreground">{t("account.wishlist")}</p>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">{t("account.recentOrders")}</h3>
          <Link href="/account/orders" className="text-sm text-primary hover:underline">
            {t("account.viewAll")}
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center bg-card rounded-xl">
            {t("account.noOrders")}{" "}
            <Link href="/products" className="text-primary hover:underline">
              {t("account.startShopping")}
            </Link>
          </p>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order.id} className="bg-card rounded-xl shadow-warm-sm p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{order.order_number}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">${order.total.toFixed(2)}</p>
                  <p className="text-xs capitalize text-muted-foreground">{order.status}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
