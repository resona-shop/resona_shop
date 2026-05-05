"use client";

import { useState, useTransition } from "react";
import { useT } from "@/lib/admin-i18n";
import type { NavigationMenuItem } from "@/lib/navigation-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { GripVertical, Plus, RotateCcw, Save, Trash2 } from "lucide-react";

export function SettingsContent({
  stripeConnected,
  supabaseConnected,
  menuItems,
  onSaveNavigationMenu,
  onResetNavigationMenu,
}: {
  stripeConnected: boolean;
  supabaseConnected: boolean;
  menuItems: NavigationMenuItem[];
  onSaveNavigationMenu: (formData: FormData) => Promise<{ error?: string; success?: boolean; items?: NavigationMenuItem[] }>;
  onResetNavigationMenu: () => Promise<{ error?: string; success?: boolean; items?: NavigationMenuItem[] }>;
}) {
  const t = useT();
  const [items, setItems] = useState(menuItems);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function updateItem(index: number, updates: Partial<NavigationMenuItem>) {
    setItems((current) =>
      current.map((item, i) => (i === index ? { ...item, ...updates } : item))
    );
  }

  function moveItem(index: number, direction: -1 | 1) {
    setItems((current) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= current.length) return current;
      const next = [...current];
      const [item] = next.splice(index, 1);
      next.splice(nextIndex, 0, item);
      return next.map((entry, i) => ({ ...entry, sort_order: i }));
    });
  }

  function addItem() {
    setItems((current) => [
      ...current,
      {
        label: t("settings.navigationNewItem"),
        href: "/",
        has_menu: false,
        is_active: true,
        sort_order: current.length,
        parent_id: null,
      },
    ]);
  }

  function removeItem(index: number) {
    setItems((current) =>
      current
        .filter((_, i) => i !== index)
        .map((item, i) => ({ ...item, sort_order: i }))
    );
  }

  function handleSave() {
    setMessage(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.set("items", JSON.stringify(items));
      const result = await onSaveNavigationMenu(formData);
      if (result.items) {
        setItems(result.items);
      }
      setMessage(result.error || t("settings.navigationSaved"));
    });
  }

  function handleReset() {
    setMessage(null);
    startTransition(async () => {
      const result = await onResetNavigationMenu();
      if (result.error) {
        setMessage(result.error);
        return;
      }
      if (result.items) {
        setItems(result.items);
      }
      setMessage(t("settings.navigationSaved"));
    });
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{t("settings.title")}</h1>

      <div className="bg-card rounded-xl shadow-warm-sm p-6 max-w-lg">
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium">{t("settings.storeName")}</p>
            <p className="text-sm text-muted-foreground">Resona</p>
          </div>
          <div>
            <p className="text-sm font-medium">{t("settings.currency")}</p>
            <p className="text-sm text-muted-foreground">USD</p>
          </div>
          <div>
            <p className="text-sm font-medium">{t("settings.freeShipping")}</p>
            <p className="text-sm text-muted-foreground">$80.00</p>
          </div>
          <div>
            <p className="text-sm font-medium">{t("settings.shippingRate")}</p>
            <p className="text-sm text-muted-foreground">$9.99</p>
          </div>
          <div>
            <p className="text-sm font-medium">{t("settings.stripe")}</p>
            <p className="text-sm text-muted-foreground">
              {stripeConnected ? t("settings.connected") : t("settings.notConfigured")}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium">Supabase</p>
            <p className="text-sm text-muted-foreground">
              {supabaseConnected ? t("settings.connected") : t("settings.notConfigured")}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-xl shadow-warm-sm p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">{t("settings.navigation")}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {t("settings.navigationDesc")}
            </p>
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={addItem}>
              <Plus className="h-4 w-4" />
              {t("settings.navigationAdd")}
            </Button>
            <Button type="button" variant="outline" onClick={handleReset} disabled={isPending}>
              <RotateCcw className="h-4 w-4" />
              {t("settings.navigationReset")}
            </Button>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="w-36 px-2 py-2 font-medium text-muted-foreground">{t("settings.navigationOrder")}</th>
                  <th className="px-2 py-2 font-medium text-muted-foreground">{t("settings.navigationLabel")}</th>
                  <th className="px-2 py-2 font-medium text-muted-foreground">{t("settings.navigationLink")}</th>
                  <th className="w-40 px-2 py-2 font-medium text-muted-foreground">{t("settings.navigationParent")}</th>
                  <th className="w-28 px-2 py-2 font-medium text-muted-foreground">{t("settings.navigationDropdown")}</th>
                  <th className="w-24 px-2 py-2 font-medium text-muted-foreground">{t("settings.navigationVisible")}</th>
                  <th className="w-24 px-2 py-2 font-medium text-muted-foreground text-right">{t("settings.navigationActions")}</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id || `new-${index}`} className="border-b border-border/50">
                    <td className="px-2 py-3">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <GripVertical className="h-4 w-4" />
                        <button
                          type="button"
                          className="min-w-10 whitespace-nowrap rounded border border-border px-2 py-0.5 text-xs hover:bg-muted"
                          onClick={() => moveItem(index, -1)}
                        >
                          {t("settings.navigationUp")}
                        </button>
                        <button
                          type="button"
                          className="min-w-10 whitespace-nowrap rounded border border-border px-2 py-0.5 text-xs hover:bg-muted"
                          onClick={() => moveItem(index, 1)}
                        >
                          {t("settings.navigationDown")}
                        </button>
                      </div>
                    </td>
                    <td className="px-2 py-3">
                      <Input
                        value={item.label}
                        onChange={(event) => updateItem(index, { label: event.target.value })}
                        className="bg-background"
                      />
                    </td>
                    <td className="px-2 py-3">
                      <Input
                        value={item.href}
                        onChange={(event) => updateItem(index, { href: event.target.value })}
                        className="bg-background"
                      />
                    </td>
                    <td className="px-2 py-3">
                      <select
                        value={item.parent_id || ""}
                        onChange={(event) => updateItem(index, { parent_id: event.target.value || null })}
                        className="h-8 w-full rounded-lg border border-input bg-background px-2 text-sm"
                      >
                        <option value="">{t("settings.navigationTopLevel")}</option>
                        {items
                          .filter((candidate, candidateIndex) => candidateIndex !== index && candidate.id && !candidate.parent_id)
                          .map((candidate, candidateIndex) => (
                            <option key={`${candidate.id}-${candidateIndex}`} value={candidate.id}>
                              {candidate.label}
                            </option>
                          ))}
                      </select>
                    </td>
                    <td className="px-2 py-3">
                      <label className="flex items-center gap-2">
                        <Checkbox
                          checked={item.has_menu}
                          onCheckedChange={(checked) => updateItem(index, { has_menu: Boolean(checked) })}
                        />
                        <Badge variant={item.has_menu ? "secondary" : "outline"}>
                          {item.has_menu ? t("settings.navigationOn") : t("settings.navigationOff")}
                        </Badge>
                      </label>
                    </td>
                    <td className="px-2 py-3">
                      <label className="flex items-center gap-2">
                        <Checkbox
                          checked={item.is_active}
                          onCheckedChange={(checked) => updateItem(index, { is_active: Boolean(checked) })}
                        />
                        <span className="text-xs text-muted-foreground">
                          {item.is_active ? t("settings.navigationShow") : t("settings.navigationHide")}
                        </span>
                      </label>
                    </td>
                    <td className="px-2 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="inline-flex items-center gap-1 text-xs text-destructive hover:underline"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        {t("settings.navigationDelete")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center gap-3">
            <Button type="button" onClick={handleSave} disabled={isPending} className="bg-gradient-golden text-white hover:opacity-90">
              <Save className="h-4 w-4" />
              {t("settings.navigationSave")}
            </Button>
            {message && (
              <p className="text-sm text-muted-foreground">{message}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
