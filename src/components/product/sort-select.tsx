"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useShopT } from "@/lib/shop-i18n";

export function SortSelect({ defaultValue }: { defaultValue: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useShopT();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("sort", e.target.value);
    router.push(`/products?${params.toString()}`);
  }

  return (
    <select
      defaultValue={defaultValue}
      onChange={handleChange}
      className="text-sm bg-secondary border-none rounded-lg px-3 py-1.5 cursor-pointer"
    >
      <option value="newest">{t("products.newest")}</option>
      <option value="price-asc">{t("products.priceLow")}</option>
      <option value="price-desc">{t("products.priceHigh")}</option>
    </select>
  );
}
