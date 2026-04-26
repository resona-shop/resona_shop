"use client";

import { useT } from "@/lib/admin-i18n";

export function NewProductTitle() {
  const t = useT();
  return <h1 className="text-2xl font-semibold">{t("products.new")}</h1>;
}

export function EditProductTitle() {
  const t = useT();
  return <h1 className="text-2xl font-semibold">{t("products.editTitle")}</h1>;
}
