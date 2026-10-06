"use server";

import type { SupabaseClient } from "@supabase/supabase-js";
import { getStripeServer } from "@/lib/stripe/server";
import { requireAdmin } from "@/lib/auth";
import { markOrderRefunded, PAID_ORDER_STATUSES } from "@/lib/orders";
import { defaultNavigationMenuItems } from "@/lib/navigation-menu";
import { slugify } from "@/lib/utils";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const NAV_COLUMNS = "id, label, href, has_menu, is_active, sort_order, parent_id";

async function uniqueSlug(
  supabase: SupabaseClient,
  table: "products" | "collections" | "categories",
  source: string,
  excludeId?: string
) {
  const base = slugify(source) || `item-${Date.now().toString(36)}`;
  const { data } = await supabase.from(table).select("id, slug").like("slug", `${base}%`);
  const taken = new Set(
    (data || []).filter((row) => row.id !== excludeId).map((row) => row.slug as string)
  );
  if (!taken.has(base)) return base;
  let n = 2;
  while (taken.has(`${base}-${n}`)) n++;
  return `${base}-${n}`;
}

function text(formData: FormData, key: string) {
  return ((formData.get(key) as string) || "").trim();
}

function optionalText(formData: FormData, key: string) {
  return text(formData, key) || null;
}

function intOrZero(formData: FormData, key: string) {
  const n = parseInt(text(formData, key), 10);
  return Number.isFinite(n) ? n : 0;
}

export async function getAdminStats() {
  const supabase = await requireAdmin();

  const [
    { count: productCount },
    { count: orderCount },
    { count: customerCount },
    { data: recentOrders },
    { data: revenueData },
    { count: lowStockCount },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .neq("status", "pending"),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "customer"),
    supabase
      .from("orders")
      .select("*")
      .neq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase.from("orders").select("total").in("status", PAID_ORDER_STATUSES),
    supabase
      .from("product_variants")
      .select("*", { count: "exact", head: true })
      .lte("stock_quantity", 5)
      .eq("is_active", true),
  ]);

  const totalRevenue = (revenueData || []).reduce(
    (sum, o) => sum + Number(o.total),
    0
  );

  return {
    productCount: productCount || 0,
    orderCount: orderCount || 0,
    customerCount: customerCount || 0,
    totalRevenue,
    lowStockCount: lowStockCount || 0,
    recentOrders: recentOrders || [],
  };
}

export async function saveNavigationMenu(formData: FormData) {
  const supabase = await requireAdmin();
  const itemsJson = formData.get("items") as string;

  let items: Array<{
    id?: string;
    label: string;
    href: string;
    has_menu: boolean;
    is_active: boolean;
    sort_order: number;
    parent_id?: string | null;
  }>;

  try {
    items = JSON.parse(itemsJson);
  } catch {
    return { error: "Invalid menu data" };
  }

  const existingIds = items
    .map((item) => item.id)
    .filter((id): id is string => Boolean(id));
  const retainedIds = new Set(existingIds);

  const sanitized = items.map((item, index) => ({
    id: item.id,
    label: item.label.trim(),
    href: item.href.trim() || "/",
    has_menu: Boolean(item.has_menu),
    is_active: Boolean(item.is_active),
    sort_order: index,
    parent_id:
      item.parent_id && item.parent_id !== item.id && retainedIds.has(item.parent_id)
        ? item.parent_id
        : null,
  }));

  if (sanitized.some((item) => !item.label)) {
    return { error: "Menu labels cannot be empty" };
  }

  const badLink = sanitized.find(
    (item) =>
      !/^https?:\/\//.test(item.href) &&
      (!item.href.startsWith("/") || item.href.startsWith("//"))
  );
  if (badLink) {
    return { error: `Invalid link for "${badLink.label}": ${badLink.href}` };
  }

  const deleteQuery = supabase.from("navigation_menu_items").delete();
  const { error: deleteError } = existingIds.length > 0
    ? await deleteQuery.not("id", "in", `(${existingIds.join(",")})`)
    : await deleteQuery.neq("label", "");

  if (deleteError) return { error: deleteError.message };

  const { error } = await supabase
    .from("navigation_menu_items")
    .upsert(
      sanitized.map(({ id, ...item }) => id ? { id, ...item } : item),
      { onConflict: "id" }
    );

  if (error) return { error: error.message };

  const { data: savedItems, error: fetchError } = await supabase
    .from("navigation_menu_items")
    .select(NAV_COLUMNS)
    .order("sort_order", { ascending: true });

  if (fetchError) return { error: fetchError.message };

  revalidatePath("/");
  return { success: true, items: savedItems || [] };
}

export async function resetNavigationMenu() {
  const supabase = await requireAdmin();
  const { error: deleteError } = await supabase
    .from("navigation_menu_items")
    .delete()
    .neq("label", "");

  if (deleteError) return { error: deleteError.message };

  const { error } = await supabase
    .from("navigation_menu_items")
    .insert(defaultNavigationMenuItems);

  if (error) return { error: error.message };

  revalidatePath("/");
  const { data: savedItems, error: fetchError } = await supabase
    .from("navigation_menu_items")
    .select(NAV_COLUMNS)
    .order("sort_order", { ascending: true });

  if (fetchError) return { error: fetchError.message };

  return { success: true, items: savedItems || [] };
}

export async function saveAnnouncement(value: {
  enabled: boolean;
  en: string;
  vi: string;
}) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("site_settings").upsert(
    {
      key: "announcement",
      value: {
        enabled: Boolean(value.enabled),
        en: value.en.trim(),
        vi: value.vi.trim(),
      },
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" }
  );
  if (error) return { error: error.message };
  revalidatePath("/");
  return { success: true };
}

export async function getAdminProducts(search?: string) {
  const supabase = await requireAdmin();
  let query = supabase
    .from("products")
    .select("*, category:categories(name), images:product_images(*), variants:product_variants(*)")
    .order("created_at", { ascending: false });

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  const { data } = await query;
  return data || [];
}

export async function getAdminProductsPage(options?: {
  search?: string;
  page?: number;
  perPage?: number;
}) {
  const supabase = await requireAdmin();
  const page = Math.max(options?.page || 1, 1);
  const perPage = options?.perPage || 20;
  const from = (page - 1) * perPage;

  let query = supabase
    .from("products")
    .select("*, category:categories(name), variants:product_variants(id)", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, from + perPage - 1);

  if (options?.search) {
    query = query.ilike("name", `%${options.search}%`);
  }

  const { data, count } = await query;
  return {
    products: data || [],
    total: count || 0,
    page,
    totalPages: Math.max(Math.ceil((count || 0) / perPage), 1),
  };
}

export async function getAdminOrders(options?: {
  status?: string;
  search?: string;
  sort?: string;
  page?: number;
  perPage?: number;
}) {
  const supabase = await requireAdmin();
  const page = options?.page || 1;
  const perPage = options?.perPage || 20;
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let query = supabase
    .from("orders")
    .select("*, items:order_items(*), user:profiles(full_name, email)", { count: "exact" });

  if (options?.status && options.status !== "all") {
    query = query.eq("status", options.status);
  } else {
    // Unpaid checkout attempts only show up under the "pending" filter.
    query = query.neq("status", "pending");
  }

  if (options?.search) {
    query = query.ilike("order_number", `%${options.search}%`);
  }

  switch (options?.sort) {
    case "date-asc":
      query = query.order("created_at", { ascending: true });
      break;
    case "total-desc":
      query = query.order("total", { ascending: false });
      break;
    case "total-asc":
      query = query.order("total", { ascending: true });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  query = query.range(from, to);

  const { data, count } = await query;
  return {
    orders: data || [],
    total: count || 0,
    page,
    perPage,
    totalPages: Math.ceil((count || 0) / perPage),
  };
}

export async function getAdminOrderById(id: string) {
  const supabase = await requireAdmin();
  const { data } = await supabase
    .from("orders")
    .select("*, items:order_items(*), user:profiles(id, full_name, email, phone)")
    .eq("id", id)
    .single();
  return data;
}

export async function updateOrderStatus(id: string, status: string) {
  const supabase = await requireAdmin();
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}

export async function updateOrderNotes(id: string, notes: string) {
  const supabase = await requireAdmin();
  const { error } = await supabase
    .from("orders")
    .update({ notes })
    .eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}

export async function updateOrderTracking(
  id: string,
  data: { shipping_carrier: string; tracking_number: string }
) {
  const supabase = await requireAdmin();
  const { error } = await supabase
    .from("orders")
    .update({
      shipping_carrier: data.shipping_carrier,
      tracking_number: data.tracking_number,
      status: "shipped",
      shipped_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}

export async function markOrderDelivered(id: string) {
  const supabase = await requireAdmin();
  const { error } = await supabase
    .from("orders")
    .update({
      status: "delivered",
      delivered_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}

export async function updateOrderAddress(id: string, address: Record<string, string>) {
  const supabase = await requireAdmin();
  const { error } = await supabase
    .from("orders")
    .update({ shipping_address: address })
    .eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}

export async function updateOrderAmounts(
  id: string,
  amounts: { subtotal: number; shipping_cost: number; tax: number; total: number }
) {
  const supabase = await requireAdmin();
  const { error } = await supabase
    .from("orders")
    .update(amounts)
    .eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}

export async function approveRefund(orderId: string) {
  const supabase = await requireAdmin();

  const { data: order } = await supabase
    .from("orders")
    .select("id, status, stripe_payment_intent_id")
    .eq("id", orderId)
    .single();

  if (!order) return { error: "Order not found" };
  if (order.status !== "refund_requested") return { error: "Order is not pending refund" };
  if (!order.stripe_payment_intent_id) return { error: "No payment intent found" };

  try {
    const stripe = getStripeServer();
    await stripe.refunds.create({
      payment_intent: order.stripe_payment_intent_id,
    });

    await markOrderRefunded(orderId);

    return { success: true };
  } catch (err: unknown) {
    console.error("Approve refund error:", err);
    const message =
      err instanceof Error ? err.message : "Failed to process refund";
    return { error: message };
  }
}

export async function rejectRefund(orderId: string) {
  const supabase = await requireAdmin();

  const { data: order } = await supabase
    .from("orders")
    .select("id, status")
    .eq("id", orderId)
    .single();

  if (!order) return { error: "Order not found" };
  if (order.status !== "refund_requested") return { error: "Order is not pending refund" };

  const { error } = await supabase
    .from("orders")
    .update({ status: "confirmed" })
    .eq("id", orderId);

  if (error) return { error: error.message };
  return { success: true };
}

export async function getAdminCustomers(search?: string) {
  const supabase = await requireAdmin();

  let query = supabase
    .from("profiles")
    .select("*")
    .eq("role", "customer")
    .order("created_at", { ascending: false });

  const term = search?.replace(/[,()%*\\"]/g, " ").trim();
  if (term) {
    query = query.or(`full_name.ilike.%${term}%,email.ilike.%${term}%`);
  }

  const { data: customers } = await query;
  if (!customers || customers.length === 0) return [];

  const { data: orders } = await supabase
    .from("orders")
    .select("user_id, total, status")
    .in("user_id", customers.map((c) => c.id))
    .neq("status", "pending");

  const totals = new Map<string, { count: number; spent: number }>();
  for (const order of orders || []) {
    const entry = totals.get(order.user_id) || { count: 0, spent: 0 };
    entry.count += 1;
    if ((PAID_ORDER_STATUSES as readonly string[]).includes(order.status)) {
      entry.spent += Number(order.total);
    }
    totals.set(order.user_id, entry);
  }

  return customers.map((customer) => ({
    ...customer,
    order_count: totals.get(customer.id)?.count || 0,
    total_spent: totals.get(customer.id)?.spent || 0,
  }));
}

export async function getCustomerOrders(customerId: string) {
  const supabase = await requireAdmin();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", customerId)
    .single();

  const { data: orders } = await supabase
    .from("orders")
    .select("*, items:order_items(*)")
    .eq("user_id", customerId)
    .neq("status", "pending")
    .order("created_at", { ascending: false });

  return { profile, orders: orders || [] };
}

interface ImageInput {
  url: string;
  is_primary: boolean;
  sort_order: number;
}

interface VariantInput {
  id?: string;
  size: string;
  color: string;
  sku: string;
  price_override: string;
  stock_quantity: string;
  is_active: boolean;
}

function parseJsonList<T>(value: FormDataEntryValue | null): T[] | null {
  if (typeof value !== "string" || !value) return null;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? (parsed as T[]) : null;
  } catch {
    return null;
  }
}

function productFields(formData: FormData) {
  const basePrice = parseFloat(text(formData, "base_price"));
  const comparePrice = parseFloat(text(formData, "compare_at_price"));
  return {
    name: text(formData, "name"),
    name_vi: optionalText(formData, "name_vi"),
    description: text(formData, "description"),
    description_vi: optionalText(formData, "description_vi"),
    category_id: optionalText(formData, "category_id"),
    base_price: basePrice,
    compare_at_price: Number.isFinite(comparePrice) && comparePrice > 0 ? comparePrice : null,
    is_active: formData.get("is_active") === "on",
    is_featured: formData.get("is_featured") === "on",
  };
}

function variantRow(productId: string, v: VariantInput) {
  const price = parseFloat(v.price_override);
  return {
    product_id: productId,
    size: v.size,
    color: v.color.trim(),
    sku: v.sku?.trim() || null,
    price_override: Number.isFinite(price) && price > 0 ? price : null,
    stock_quantity: Math.max(parseInt(v.stock_quantity, 10) || 0, 0),
    is_active: Boolean(v.is_active),
  };
}

export async function createProduct(formData: FormData) {
  const supabase = await requireAdmin();

  const fields = productFields(formData);
  if (!fields.name) return { error: "Name is required" };
  if (!Number.isFinite(fields.base_price) || fields.base_price < 0) {
    return { error: "Invalid price" };
  }

  const slug = await uniqueSlug(supabase, "products", text(formData, "slug") || fields.name);

  const { data, error } = await supabase
    .from("products")
    .insert({ ...fields, slug })
    .select("id")
    .single();

  if (error || !data) return { error: error?.message || "Failed to create product" };

  const images = parseJsonList<ImageInput>(formData.get("images")) || [];
  if (images.length > 0) {
    const { error: imageError } = await supabase.from("product_images").insert(
      images.map((img) => ({
        product_id: data.id,
        url: img.url,
        is_primary: img.is_primary,
        sort_order: img.sort_order,
      }))
    );
    if (imageError) return { error: imageError.message };
  }

  const variants = parseJsonList<VariantInput>(formData.get("variants")) || [];
  if (variants.length > 0) {
    const { error: variantError } = await supabase
      .from("product_variants")
      .insert(variants.map((v) => variantRow(data.id, v)));
    if (variantError) return { error: variantError.message };
  }

  redirect(`/admin/products`);
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = await requireAdmin();

  const fields = productFields(formData);
  if (!fields.name) return { error: "Name is required" };
  if (!Number.isFinite(fields.base_price) || fields.base_price < 0) {
    return { error: "Invalid price" };
  }

  const requestedSlug = text(formData, "slug");
  const update: Record<string, unknown> = { ...fields };
  if (requestedSlug) {
    update.slug = await uniqueSlug(supabase, "products", requestedSlug, id);
  }

  const { error } = await supabase.from("products").update(update).eq("id", id);
  if (error) return { error: error.message };

  const images = parseJsonList<ImageInput>(formData.get("images"));
  if (images) {
    await supabase.from("product_images").delete().eq("product_id", id);

    if (images.length > 0) {
      const { error: imageError } = await supabase.from("product_images").insert(
        images.map((img) => ({
          product_id: id,
          url: img.url,
          is_primary: img.is_primary,
          sort_order: img.sort_order,
        }))
      );
      if (imageError) return { error: imageError.message };
    }
  }

  // Variants are updated in place: orders and customers' carts reference
  // variant ids, so they must survive an edit.
  const variants = parseJsonList<VariantInput>(formData.get("variants"));
  if (variants) {
    const { data: existing } = await supabase
      .from("product_variants")
      .select("id")
      .eq("product_id", id);
    const existingIds = new Set((existing || []).map((v) => v.id as string));
    const keptIds = new Set(
      variants.map((v) => v.id).filter((vid): vid is string => !!vid && existingIds.has(vid))
    );

    for (const removedId of existingIds) {
      if (keptIds.has(removedId)) continue;
      const { error: deleteError } = await supabase
        .from("product_variants")
        .delete()
        .eq("id", removedId);
      if (deleteError) {
        // Already ordered, so it cannot be deleted: retire it instead.
        await supabase
          .from("product_variants")
          .update({ is_active: false, stock_quantity: 0 })
          .eq("id", removedId);
      }
    }

    for (const v of variants) {
      const row = variantRow(id, v);
      const { error: variantError } =
        v.id && existingIds.has(v.id)
          ? await supabase.from("product_variants").update(row).eq("id", v.id)
          : await supabase.from("product_variants").insert(row);
      if (variantError) return { error: variantError.message };
    }
  }

  redirect(`/admin/products`);
}

export async function deleteProduct(id: string) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) {
    if (error.code === "23503") {
      // Has order history: take it off the storefront instead of deleting.
      const { error: archiveError } = await supabase
        .from("products")
        .update({ is_active: false, is_featured: false })
        .eq("id", id);
      if (archiveError) return { error: archiveError.message };
      return { success: true, archived: true };
    }
    return { error: error.message };
  }
  return { success: true };
}

export async function getAdminCollections() {
  const supabase = await requireAdmin();
  const { data } = await supabase
    .from("collections")
    .select("*")
    .order("sort_order");
  return data || [];
}

function collectionFields(formData: FormData) {
  return {
    name: text(formData, "name"),
    name_vi: optionalText(formData, "name_vi"),
    description: optionalText(formData, "description"),
    description_vi: optionalText(formData, "description_vi"),
    image_url: optionalText(formData, "image_url"),
    sort_order: intOrZero(formData, "sort_order"),
    is_active: formData.get("is_active") === "on",
  };
}

export async function createCollection(formData: FormData) {
  const supabase = await requireAdmin();
  const fields = collectionFields(formData);
  if (!fields.name) return { error: "Name is required" };

  const slug = await uniqueSlug(supabase, "collections", fields.name);
  const { error } = await supabase.from("collections").insert({ ...fields, slug });
  if (error) return { error: error.message };
  return { success: true };
}

export async function updateCollection(id: string, formData: FormData) {
  const supabase = await requireAdmin();
  const fields = collectionFields(formData);
  if (!fields.name) return { error: "Name is required" };

  const { error } = await supabase
    .from("collections")
    .update(fields)
    .eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}

export async function deleteCollection(id: string) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("collections").delete().eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}

export async function getCollectionProductMap() {
  const supabase = await requireAdmin();
  const { data } = await supabase
    .from("product_collections")
    .select("collection_id, product_id");

  const map: Record<string, string[]> = {};
  for (const row of data || []) {
    (map[row.collection_id] ||= []).push(row.product_id);
  }
  return map;
}

export async function updateCollectionProducts(collectionId: string, productIds: string[]) {
  const supabase = await requireAdmin();
  const { error: deleteError } = await supabase
    .from("product_collections")
    .delete()
    .eq("collection_id", collectionId);
  if (deleteError) return { error: deleteError.message };

  if (productIds.length > 0) {
    const { error } = await supabase.from("product_collections").insert(
      productIds.map((pid) => ({ collection_id: collectionId, product_id: pid }))
    );
    if (error) return { error: error.message };
  }
  return { success: true };
}

export async function getAdminCategories() {
  const supabase = await requireAdmin();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");
  return data || [];
}

function categoryFields(formData: FormData) {
  return {
    name: text(formData, "name"),
    name_vi: optionalText(formData, "name_vi"),
    description: optionalText(formData, "description"),
    parent_id: optionalText(formData, "parent_id"),
    sort_order: intOrZero(formData, "sort_order"),
  };
}

export async function createCategory(formData: FormData) {
  const supabase = await requireAdmin();
  const fields = categoryFields(formData);
  if (!fields.name) return { error: "Name is required" };

  const slug = await uniqueSlug(supabase, "categories", fields.name);
  const { error } = await supabase.from("categories").insert({ ...fields, slug });
  if (error) return { error: error.message };
  return { success: true };
}

export async function updateCategory(id: string, formData: FormData) {
  const supabase = await requireAdmin();
  const fields = categoryFields(formData);
  if (!fields.name) return { error: "Name is required" };
  if (fields.parent_id === id) fields.parent_id = null;

  const { error } = await supabase
    .from("categories")
    .update(fields)
    .eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}

export async function deleteCategory(id: string) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}

export async function getInventory() {
  const supabase = await requireAdmin();
  const { data } = await supabase
    .from("product_variants")
    .select("*, product:products(name, slug)")
    .order("stock_quantity", { ascending: true });
  return data || [];
}

export async function updateStock(variantId: string, quantity: number) {
  const supabase = await requireAdmin();
  const { error } = await supabase
    .from("product_variants")
    .update({ stock_quantity: Math.max(Math.floor(quantity) || 0, 0) })
    .eq("id", variantId);
  if (error) return { error: error.message };
  return { success: true };
}

export async function getAdminReviews() {
  const supabase = await requireAdmin();
  const { data } = await supabase
    .from("reviews")
    .select("*, product:products(name, slug), user:profiles(full_name, email)")
    .order("created_at", { ascending: false });
  return data || [];
}

export async function deleteReview(id: string) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/reviews");
  return { success: true };
}

export async function getNewsletterSubscribers() {
  const supabase = await requireAdmin();
  const { data } = await supabase
    .from("newsletter_subscribers")
    .select("id, email, created_at")
    .order("created_at", { ascending: false });
  return data || [];
}

export async function deleteNewsletterSubscriber(id: string) {
  const supabase = await requireAdmin();
  const { error } = await supabase
    .from("newsletter_subscribers")
    .delete()
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/newsletter");
  return { success: true };
}
