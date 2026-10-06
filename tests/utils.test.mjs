import { test } from "node:test";
import assert from "node:assert/strict";
import { safeRedirectPath, slugify } from "../src/lib/utils.ts";
import { HERO_IMAGE_KEY, sanitizeContentOverrides } from "../src/lib/site-content.ts";

test("slugify produces url-safe slugs", () => {
  assert.equal(slugify("Linen Wrap Dress"), "linen-wrap-dress");
  assert.equal(slugify("  Summer -- Glow!  "), "summer-glow");
  assert.equal(slugify("Café Crème"), "cafe-creme");
  assert.equal(slugify("Áo Dài Đỏ"), "ao-dai-do");
});

test("slugify keeps non-latin names instead of returning nothing", () => {
  assert.equal(slugify("亚麻连衣裙"), "亚麻连衣裙");
  assert.equal(slugify("!!!"), "");
});

test("safeRedirectPath only allows same-site paths", () => {
  assert.equal(safeRedirectPath("/account/orders"), "/account/orders");
  assert.equal(safeRedirectPath("/products?category=tops"), "/products?category=tops");
  for (const bad of [null, undefined, "", "https://evil.example", "//evil.example", "@evil.example", "/\\evil.example"]) {
    assert.equal(safeRedirectPath(bad), "/", String(bad));
  }
});

test("sanitizeContentOverrides drops unknown keys and blanks", () => {
  assert.deepEqual(
    sanitizeContentOverrides({
      "hero.title1": "  Hello  ",
      "hero.title2": "   ",
      [HERO_IMAGE_KEY]: "https://example.com/hero.jpg",
      "cart.checkout": "not editable",
      "footer.brand": 42,
    }),
    { "hero.title1": "Hello", [HERO_IMAGE_KEY]: "https://example.com/hero.jpg" }
  );
  assert.deepEqual(sanitizeContentOverrides(null), {});
});
