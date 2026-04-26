"use client";

import { useState } from "react";
import { useT } from "@/lib/admin-i18n";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pencil, Trash2, X } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parent_id: string | null;
}

export function CategoriesContent({
  categories,
  onCreate,
  onUpdate,
  onDelete,
}: {
  categories: Category[];
  onCreate: (formData: FormData) => Promise<void>;
  onUpdate: (id: string, formData: FormData) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const t = useT();
  const [editingId, setEditingId] = useState<string | null>(null);

  const topLevel = categories.filter((c) => !c.parent_id);
  const getChildren = (parentId: string) =>
    categories.filter((c) => c.parent_id === parentId);
  const editingItem = categories.find((c) => c.id === editingId);

  function renderRow(cat: Category, indent: boolean = false) {
    return (
      <tr key={cat.id} className={`border-b border-border/50 ${indent ? "bg-muted/30" : ""}`}>
        <td className={`px-4 py-3 font-medium ${indent ? "pl-8 text-muted-foreground" : ""}`}>
          {indent && "└ "}{cat.name}
        </td>
        <td className="px-4 py-3 text-muted-foreground">{cat.slug}</td>
        <td className="px-4 py-3 text-right">
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => setEditingId(cat.id)}
              className="text-xs text-primary hover:underline inline-flex items-center gap-1"
            >
              <Pencil className="h-3 w-3" />
              {t("categories.edit")}
            </button>
            <button
              onClick={() => onDelete(cat.id)}
              className="text-xs text-destructive hover:underline inline-flex items-center gap-1"
            >
              <Trash2 className="h-3 w-3" />
              {t("common.delete")}
            </button>
          </div>
        </td>
      </tr>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{t("categories.title")}</h1>

      <div className="bg-card rounded-xl shadow-warm-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="px-4 py-3 font-medium text-muted-foreground">{t("table.name")}</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">{t("table.slug")}</th>
              <th className="px-4 py-3 font-medium text-muted-foreground text-right">{t("table.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {topLevel.map((cat) => (
              <>{renderRow(cat)}{getChildren(cat.id).map((child) => renderRow(child, true))}</>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">
                  {t("categories.noCategories")}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit form */}
      {editingItem && (
        <div className="bg-card rounded-xl shadow-warm-sm p-6 max-w-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium">{t("categories.editing")}</h2>
            <button onClick={() => setEditingId(null)} className="p-1 text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
          <form
            action={async (formData) => {
              await onUpdate(editingItem.id, formData);
              setEditingId(null);
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="edit-name">{t("table.name")}</Label>
              <Input id="edit-name" name="name" required defaultValue={editingItem.name} className="bg-background" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">{t("form.description")}</Label>
              <Input id="edit-description" name="description" defaultValue={editingItem.description || ""} className="bg-background" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-parent_id">{t("categories.parent")}</Label>
              <select
                id="edit-parent_id"
                name="parent_id"
                defaultValue={editingItem.parent_id || ""}
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">{t("categories.noParent")}</option>
                {topLevel
                  .filter((c) => c.id !== editingItem.id)
                  .map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
              </select>
            </div>
            <Button type="submit" className="bg-gradient-golden text-white hover:opacity-90">
              {t("categories.update")}
            </Button>
          </form>
        </div>
      )}

      {/* Create form */}
      {!editingId && (
        <div className="bg-card rounded-xl shadow-warm-sm p-6 max-w-md">
          <h2 className="font-medium mb-4">{t("categories.new")}</h2>
          <form action={onCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t("table.name")}</Label>
              <Input id="name" name="name" required className="bg-background" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">{t("form.description")}</Label>
              <Input id="description" name="description" className="bg-background" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parent_id">{t("categories.parent")}</Label>
              <select
                id="parent_id"
                name="parent_id"
                className="w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="">{t("categories.noParent")}</option>
                {topLevel.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <Button type="submit" className="bg-gradient-golden text-white hover:opacity-90">
              {t("categories.create")}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
