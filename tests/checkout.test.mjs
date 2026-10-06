import { test } from "node:test";
import assert from "node:assert/strict";
import {
  MAX_QUANTITY_PER_ITEM,
  parseCheckoutItems,
  resolveCheckoutLines,
  sumCheckoutLines,
} from "../src/lib/checkout.ts";

function variant(overrides = {}) {
  return {
    id: "v1",
    size: "M",
    color: "Coral",
    price_override: null,
    stock_quantity: 5,
    is_active: true,
    product: { id: "p1", name: "Linen Dress", base_price: 49.9, is_active: true },
    ...overrides,
  };
}

test("parseCheckoutItems keeps only ids and positive quantities", () => {
  const quantities = parseCheckoutItems([
    { variant_id: "v1", quantity: 2, price: 0.01, name: "hacked" },
    { variant_id: "v1", quantity: 1 },
    { variant_id: "v2", quantity: 0 },
    { variant_id: "v3", quantity: -4 },
    { variant_id: 42, quantity: 1 },
    { quantity: 1 },
    null,
  ]);

  assert.deepEqual([...quantities], [["v1", 3]]);
});

test("parseCheckoutItems tolerates a missing or malformed cart", () => {
  assert.equal(parseCheckoutItems(undefined).size, 0);
  assert.equal(parseCheckoutItems("nope").size, 0);
});

test("prices come from the database row, never the request", () => {
  const { lines, unavailable } = resolveCheckoutLines(new Map([["v1", 2]]), [variant()]);

  assert.deepEqual(unavailable, []);
  assert.equal(lines[0].unitAmount, 4990);
  assert.equal(lines[0].label, "Coral / M");
  assert.equal(sumCheckoutLines(lines), 9980);
});

test("a variant price override wins over the base price", () => {
  const { lines } = resolveCheckoutLines(new Map([["v1", 1]]), [
    variant({ price_override: 19.99 }),
  ]);
  assert.equal(lines[0].unitAmount, 1999);
});

test("totals are computed in cents without float drift", () => {
  const { lines } = resolveCheckoutLines(new Map([["v1", 3]]), [
    variant({ price_override: 0.1 }),
  ]);
  assert.equal(sumCheckoutLines(lines), 30);
});

test("unknown, inactive, unpublished and oversold variants are rejected", () => {
  const variants = [
    variant({ id: "inactive", is_active: false }),
    variant({ id: "unpublished", product: { id: "p", name: "X", base_price: 1, is_active: false } }),
    variant({ id: "orphan", product: null }),
    variant({ id: "low", stock_quantity: 1 }),
    variant({ id: "plenty", stock_quantity: 500 }),
    variant({ id: "ok" }),
  ];
  const { lines, unavailable } = resolveCheckoutLines(
    new Map([
      ["missing", 1],
      ["inactive", 1],
      ["unpublished", 1],
      ["orphan", 1],
      ["low", 2],
      ["plenty", MAX_QUANTITY_PER_ITEM + 1],
      ["ok", 5],
    ]),
    variants
  );

  assert.deepEqual(unavailable, ["missing", "inactive", "unpublished", "orphan", "low", "plenty"]);
  assert.deepEqual(lines.map((line) => line.variant.id), ["ok"]);
});
