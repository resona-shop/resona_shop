"use client";

import { useState } from "react";
import Image from "next/image";
import { useT } from "@/lib/admin-i18n";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { createClient } from "@/lib/supabase/client";
import { Pencil, Trash2, X, Loader2, Check, Layers, Upload, ImageIcon, RefreshCw } from "lucide-react";

interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  is_active: boolean;
}

interface SimpleProduct {
  id: string;
  name: string;
}

function CollectionImageField({
  currentUrl,
  onUploaded,
}: {
  currentUrl?: string | null;
  onUploaded: (url: string) => void;
}) {
  const t = useT();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentUrl || "");

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `collections/${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("product-images")
      .upload(path, file, { cacheControl: "3600" });
    if (!error) {
      const { data } = supabase.storage.from("product-images").getPublicUrl(path);
      setPreview(data.publicUrl);
      onUploaded(data.publicUrl);
    }
    setUploading(false);
    e.target.value = "";
  }

  return (
    <div className="space-y-2">
      <Label>{t("form.images")}</Label>
      {preview ? (
        <div className="space-y-2">
          <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden border border-border">
            <Image src={preview} alt="Collection" fill className="object-cover" sizes="400px" />
          </div>
          <div className="flex gap-2">
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-input bg-background text-xs cursor-pointer hover:bg-muted/50 transition-colors">
              <RefreshCw className="h-3 w-3" />
              {uploading ? t("form.images.uploading") : "更换图片"}
              <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
            </label>
            <button
              type="button"
              onClick={() => { setPreview(""); onUploaded(""); }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-input text-xs text-destructive hover:bg-destructive/5 transition-colors"
            >
              <Trash2 className="h-3 w-3" />
              {t("form.images.remove")}
            </button>
          </div>
        </div>
      ) : (
        <label className="flex flex-col items-center gap-2 p-8 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 transition-colors">
          {uploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          ) : (
            <Upload className="h-6 w-6 text-muted-foreground" />
          )}
          <span className="text-xs text-muted-foreground">
            {uploading ? t("form.images.uploading") : t("form.images.drag")}
          </span>
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
        </label>
      )}
    </div>
  );
}

export function CollectionsContent({
  collections,
  allProducts,
  collectionProductMap,
  onCreate,
  onUpdate,
  onDelete,
  onAssignProducts,
}: {
  collections: Collection[];
  allProducts: SimpleProduct[];
  collectionProductMap: Record<string, string[]>;
  onCreate: (formData: FormData) => Promise<void>;
  onUpdate: (id: string, formData: FormData) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onAssignProducts: (collectionId: string, productIds: string[]) => Promise<void>;
}) {
  const t = useT();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  // Form state to avoid uncontrolled warnings
  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");

  const editingItem = collections.find((c) => c.id === editingId);

  function startEditing(id: string) {
    setEditingId(id);
    setAssigningId(null);
    const col = collections.find((c) => c.id === id);
    setImageUrl(col?.image_url || "");
    setFormName(col?.name || "");
    setFormDesc(col?.description || "");
  }

  function startAssigning(colId: string) {
    setAssigningId(colId);
    setSelectedProducts(collectionProductMap[colId] || []);
    setEditingId(null);
  }

  function toggleProduct(productId: string) {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  }

  async function handleSaveProducts() {
    if (!assigningId) return;
    setSaving(true);
    await onAssignProducts(assigningId, selectedProducts);
    setSaving(false);
    setAssigningId(null);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">{t("collections.title")}</h1>

      {/* Collection cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {collections.map((col) => (
          <div key={col.id} className="bg-card rounded-xl shadow-warm-sm overflow-hidden">
            {/* Image preview */}
            <div className="relative aspect-[16/9] bg-muted">
              {col.image_url ? (
                <Image src={col.image_url} alt={col.name} fill className="object-cover" sizes="400px" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-muted-foreground/30" />
                </div>
              )}
              <div className="absolute top-2 right-2">
                <Badge
                  variant="secondary"
                  className={`text-[10px] ${col.is_active ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}
                >
                  {col.is_active ? t("collections.active") : t("collections.inactive")}
                </Badge>
              </div>
            </div>

            {/* Info */}
            <div className="p-4">
              <h3 className="font-medium">{col.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{col.slug}</p>
              {col.description && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{col.description}</p>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                {(collectionProductMap[col.id] || []).length} {t("dashboard.products").toLowerCase()}
              </p>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                <button
                  onClick={() => startAssigning(col.id)}
                  className="text-xs text-emerald-soft hover:underline inline-flex items-center gap-1"
                >
                  <Layers className="h-3 w-3" />
                  {t("collections.products")}
                </button>
                <button
                  onClick={() => startEditing(col.id)}
                  className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                >
                  <Pencil className="h-3 w-3" />
                  {t("collections.edit")}
                </button>
                <button
                  onClick={() => onDelete(col.id)}
                  className="text-xs text-destructive hover:underline inline-flex items-center gap-1 ml-auto"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {collections.length === 0 && (
          <p className="text-muted-foreground col-span-full text-center py-12">
            {t("collections.noCollections")}
          </p>
        )}
      </div>

      {/* Product assignment panel */}
      {assigningId && (
        <div className="bg-card rounded-xl shadow-warm-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-medium">{t("collections.products")}: {collections.find((c) => c.id === assigningId)?.name}</h2>
              <p className="text-xs text-muted-foreground mt-1">{t("collections.productsDesc")}</p>
            </div>
            <button onClick={() => setAssigningId(null)} className="p-1 text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 max-h-64 overflow-y-auto mb-4">
            {allProducts.map((product) => (
              <label
                key={product.id}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted/50 cursor-pointer text-sm"
              >
                <Checkbox
                  checked={selectedProducts.includes(product.id)}
                  onCheckedChange={() => toggleProduct(product.id)}
                />
                <span className="truncate">{product.name}</span>
              </label>
            ))}
          </div>
          <Button
            onClick={handleSaveProducts}
            disabled={saving}
            className="bg-gradient-golden text-white hover:opacity-90"
          >
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 h-4 w-4" />}
            {t("collections.saveProducts")} ({selectedProducts.length})
          </Button>
        </div>
      )}

      {/* Edit form */}
      {editingItem && !assigningId && (
        <div className="bg-card rounded-xl shadow-warm-sm p-6 max-w-lg">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium">{t("collections.editing")}: {editingItem.name}</h2>
            <button onClick={() => setEditingId(null)} className="p-1 text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
          <form
            action={async (formData) => {
              formData.set("image_url", imageUrl);
              await onUpdate(editingItem.id, formData);
              setEditingId(null);
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="edit-name">{t("table.name")}</Label>
              <input
                id="edit-name"
                name="name"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">{t("form.description")}</Label>
              <input
                id="edit-description"
                name="description"
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <CollectionImageField currentUrl={editingItem.image_url} onUploaded={setImageUrl} />
            <div className="flex items-center gap-2">
              <Checkbox id="edit-is_active" name="is_active" defaultChecked={editingItem.is_active} />
              <Label htmlFor="edit-is_active" className="text-sm font-normal">{t("collections.active")}</Label>
            </div>
            <Button type="submit" className="bg-gradient-golden text-white hover:opacity-90">
              {t("collections.update")}
            </Button>
          </form>
        </div>
      )}

      {/* Create form */}
      {!editingId && !assigningId && (
        <div className="bg-card rounded-xl shadow-warm-sm p-6 max-w-lg">
          <h2 className="font-medium mb-4">{t("collections.new")}</h2>
          <form
            action={async (formData) => {
              formData.set("image_url", imageUrl);
              await onCreate(formData);
              setImageUrl("");
            }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="name">{t("table.name")}</Label>
              <input
                id="name"
                name="name"
                required
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">{t("form.description")}</Label>
              <input
                id="description"
                name="description"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </div>
            <CollectionImageField onUploaded={setImageUrl} />
            <div className="flex items-center gap-2">
              <Checkbox id="is_active" name="is_active" defaultChecked />
              <Label htmlFor="is_active" className="text-sm font-normal">{t("collections.active")}</Label>
            </div>
            <Button type="submit" className="bg-gradient-golden text-white hover:opacity-90">
              {t("collections.create")}
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
