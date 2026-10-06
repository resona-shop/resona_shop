// Storefront copy that can be overridden from Admin → Settings. Keys match the
// built-in text in shop-i18n, which stays the fallback for anything left blank.

export const HERO_IMAGE_KEY = "hero.image";

export const editableContentGroups = [
  {
    id: "hero",
    fields: [
      { key: "hero.tagline", multiline: false },
      { key: "hero.title1", multiline: false },
      { key: "hero.title2", multiline: false },
      { key: "hero.subtitle", multiline: true },
    ],
  },
  {
    id: "brand",
    fields: [
      { key: "brand.tagline", multiline: false },
      { key: "brand.title1", multiline: false },
      { key: "brand.goldenHour", multiline: false },
      { key: "brand.title2", multiline: false },
      { key: "brand.you", multiline: false },
      { key: "brand.story", multiline: true },
    ],
  },
  {
    id: "footer",
    fields: [{ key: "footer.brand", multiline: true }],
  },
] as const;

export const editableContentKeys: string[] = [
  HERO_IMAGE_KEY,
  ...editableContentGroups.flatMap((group) => group.fields.map((field) => field.key)),
];

/** Keeps only known keys with non-empty values. */
export function sanitizeContentOverrides(input: unknown) {
  const result: Record<string, string> = {};
  if (!input || typeof input !== "object") return result;

  for (const key of editableContentKeys) {
    const value = (input as Record<string, unknown>)[key];
    if (typeof value === "string" && value.trim()) {
      result[key] = value.trim().slice(0, 2000);
    }
  }
  return result;
}
