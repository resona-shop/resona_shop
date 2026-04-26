"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductImage } from "@/types";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const sorted = [...images].sort((a, b) => {
    if (a.is_primary) return -1;
    if (b.is_primary) return 1;
    return a.sort_order - b.sort_order;
  });

  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!zoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPos({ x, y });
  }

  if (sorted.length === 0) {
    return (
      <div className="aspect-[3/4] rounded-2xl bg-secondary/50 shimmer" />
    );
  }

  return (
    <div className="flex flex-col-reverse sm:flex-row gap-3">
      {/* Thumbnails */}
      {sorted.length > 1 && (
        <div className="flex sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto sm:max-h-[600px] pb-1 sm:pb-0 sm:pr-1">
          {sorted.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(i)}
              className={cn(
                "relative shrink-0 w-16 h-20 sm:w-20 sm:h-24 rounded-lg overflow-hidden border-2 transition-all",
                i === activeIndex
                  ? "border-primary shadow-glow-coral"
                  : "border-transparent opacity-60 hover:opacity-100"
              )}
            >
              <Image
                src={img.url}
                alt={img.alt_text || `${productName} ${i + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Main image */}
      <div className="relative flex-1">
        <div
          className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-secondary/50 cursor-zoom-in shadow-warm"
          onClick={() => setZoomed(!zoomed)}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setZoomed(false)}
        >
          <Image
            src={sorted[activeIndex].url}
            alt={sorted[activeIndex].alt_text || productName}
            fill
            className={cn(
              "object-cover transition-transform duration-300",
              zoomed && "scale-200"
            )}
            style={
              zoomed
                ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` }
                : undefined
            }
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Nav arrows */}
        {sorted.length > 1 && (
          <>
            <button
              onClick={() =>
                setActiveIndex((i) => (i === 0 ? sorted.length - 1 : i - 1))
              }
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full glass hover:bg-white transition-colors sm:hidden"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() =>
                setActiveIndex((i) => (i === sorted.length - 1 ? 0 : i + 1))
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full glass hover:bg-white transition-colors sm:hidden"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
