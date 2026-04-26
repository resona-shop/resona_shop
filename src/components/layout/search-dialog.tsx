"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useShopT } from "@/lib/shop-i18n";

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();
  const t = useShopT();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/products?q=${encodeURIComponent(query.trim())}`);
    setOpen(false);
    setQuery("");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="p-2 text-foreground/70 hover:text-foreground transition-colors">
        <Search className="h-5 w-5" />
        <span className="sr-only">{t("search.title")}</span>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden">
        <DialogTitle className="sr-only">{t("search.title")}</DialogTitle>
        <form onSubmit={handleSubmit} className="flex items-center">
          <Search className="h-5 w-5 text-muted-foreground ml-4 shrink-0" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("search.placeholder")}
            className="border-0 focus-visible:ring-0 h-14 text-base pl-3"
            autoFocus
          />
          {query && (
            <button type="button" onClick={() => setQuery("")} className="p-2 mr-2 text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
