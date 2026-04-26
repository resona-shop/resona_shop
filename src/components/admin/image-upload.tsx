"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import { useT } from "@/lib/admin-i18n";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { Upload, X, Star, Loader2 } from "lucide-react";
import type { ProductImage } from "@/types";

interface ImageItem {
  id?: string;
  url: string;
  is_primary: boolean;
  sort_order: number;
}

interface ImageUploadProps {
  existingImages?: ProductImage[];
  onChange: (images: ImageItem[]) => void;
}

export function ImageUpload({ existingImages = [], onChange }: ImageUploadProps) {
  const t = useT();
  const [images, setImages] = useState<ImageItem[]>(
    existingImages.map((img, i) => ({
      id: img.id,
      url: img.url,
      is_primary: img.is_primary,
      sort_order: img.sort_order ?? i,
    }))
  );
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const updateImages = useCallback(
    (newImages: ImageItem[]) => {
      setImages(newImages);
      onChange(newImages);
    },
    [onChange]
  );

  async function uploadFiles(files: FileList | File[]) {
    const fileArray = Array.from(files).filter((f) =>
      ["image/jpeg", "image/png", "image/webp"].includes(f.type)
    );
    if (fileArray.length === 0) return;

    setUploading(true);
    const supabase = createClient();
    const newImages: ImageItem[] = [];

    for (const file of fileArray) {
      const ext = file.name.split(".").pop();
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

      const { error } = await supabase.storage
        .from("product-images")
        .upload(path, file, { cacheControl: "3600", upsert: false });

      if (!error) {
        const { data: urlData } = supabase.storage
          .from("product-images")
          .getPublicUrl(path);

        newImages.push({
          url: urlData.publicUrl,
          is_primary: images.length === 0 && newImages.length === 0,
          sort_order: images.length + newImages.length,
        });
      }
    }

    const updated = [...images, ...newImages];
    updateImages(updated);
    setUploading(false);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      uploadFiles(e.dataTransfer.files);
    }
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      uploadFiles(e.target.files);
      e.target.value = "";
    }
  }

  function removeImage(index: number) {
    const updated = images.filter((_, i) => i !== index);
    if (updated.length > 0 && !updated.some((img) => img.is_primary)) {
      updated[0].is_primary = true;
    }
    updated.forEach((img, i) => (img.sort_order = i));
    updateImages(updated);
  }

  function setPrimary(index: number) {
    const updated = images.map((img, i) => ({
      ...img,
      is_primary: i === index,
    }));
    updateImages(updated);
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">{t("form.images")}</label>

      {/* Existing images grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
          {images.map((img, index) => (
            <div
              key={img.url}
              className={cn(
                "relative group aspect-square rounded-lg overflow-hidden border-2 transition-all",
                img.is_primary
                  ? "border-primary shadow-glow-coral"
                  : "border-border"
              )}
            >
              <Image
                src={img.url}
                alt={`Product image ${index + 1}`}
                fill
                className="object-cover"
                sizes="120px"
              />

              {/* Primary badge */}
              {img.is_primary && (
                <span className="absolute top-1 left-1 bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded">
                  {t("form.images.primary")}
                </span>
              )}

              {/* Hover actions */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                {!img.is_primary && (
                  <button
                    type="button"
                    onClick={() => setPrimary(index)}
                    className="p-1.5 rounded-md bg-white/90 text-foreground hover:bg-white transition-colors"
                    title={t("form.images.setPrimary")}
                  >
                    <Star className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="p-1.5 rounded-md bg-white/90 text-destructive hover:bg-white transition-colors"
                  title={t("form.images.remove")}
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={cn(
          "relative border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer",
          dragOver
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50"
        )}
      >
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />

        {uploading ? (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm">{t("form.images.uploading")}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-muted-foreground">
            <Upload className="h-8 w-8" />
            <p className="text-sm">{t("form.images.drag")}</p>
            <p className="text-xs">{t("form.images.formats")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
