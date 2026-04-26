"use client";

import { useShopT } from "@/lib/shop-i18n";
import { MapPin } from "lucide-react";

interface Address {
  id: string;
  full_name: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string | null;
  postal_code: string;
  country: string;
  phone: string | null;
  is_default: boolean;
}

export function AccountAddressesContent({
  addresses,
  deleteButton,
  addForm,
}: {
  addresses: Address[];
  deleteButton: (id: string) => React.ReactNode;
  addForm: React.ReactNode;
}) {
  const t = useShopT();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-medium">{t("account.savedAddresses")}</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {addresses.map((addr) => (
          <div key={addr.id} className="bg-card rounded-xl shadow-warm-sm p-5 relative">
            {addr.is_default && (
              <span className="absolute top-3 right-3 text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                {t("account.default")}
              </span>
            )}
            <MapPin className="h-4 w-4 text-muted-foreground mb-2" />
            <p className="font-medium text-sm">{addr.full_name}</p>
            <p className="text-sm text-muted-foreground mt-1">
              {addr.line1}
              {addr.line2 && `, ${addr.line2}`}
              <br />
              {addr.city}
              {addr.state && `, ${addr.state}`} {addr.postal_code}
              <br />
              {addr.country}
            </p>
            {addr.phone && <p className="text-xs text-muted-foreground mt-1">{addr.phone}</p>}
            {deleteButton(addr.id)}
          </div>
        ))}

        {addresses.length === 0 && (
          <p className="text-muted-foreground text-sm col-span-full">
            {t("account.noOrders")}
          </p>
        )}
      </div>

      <div className="bg-card rounded-xl shadow-warm-sm p-6">
        <h3 className="font-medium mb-4">{t("account.addAddress")}</h3>
        {addForm}
      </div>
    </div>
  );
}
