"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function getAdminStats() {
  const supabase = await createClient();

  const [
    { count: productCount },
    { count: orderCount },
    { count: customerCount },
    { data: recentOrders },
    { data: revenueData },
    { count: lowStockCount },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "customer"),
    supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase.from("orders").select("total, created_at").eq("status", "confirmed"),
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

export async function getAdminProducts(search?: string) {
  const supabase = await createClient();
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

export async function getAdminOrders(options?: {
  status?: string;
  search?: string;
  sort?: string;
  page?: number;
  perPage?: number;
}) {
  const supabase = await createClient();
  const page = options?.page || 1;
  const perPage = options?.perPage || 20;
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  let query = supabase
    .from("orders")
    .select("*, items:order_items(*), user:profiles(full_name, email)", { count: "exact" });

  if (options?.status && options.status !== "all") {
    query = query.eq("status", options.status);
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
  const supabase = await createClient();
  const { data } = await supabase
    .from("orders")
    .select("*, items:order_items(*), user:profiles(id, full_name, email, phone)")
    .eq("id", id)
    .single();
  return data;
}

export async function updateOrderStatus(id: string, status: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}

export async function updateOrderNotes(id: string, notes: string) {
  const supabase = await createClient();
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
  const supabase = await createClient();
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
  const supabase = await createClient();
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
  const supabase = await createClient();
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
  const supabase = await createClient();
  const { error } = await supabase
    .from("orders")
    .update(amounts)
    .eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}

export async function getAdminCustomers(search?: string) {
  const supabase = await createClient();

  let query = supabase
    .from("profiles")
    .select("*")
    .eq("role", "customer")
    .order("created_at", { ascending: false });

  if (search) {
    query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`);
  }

  const { data: customers } = await query;

  const enriched = await Promise.all(
    (customers || []).map(async (customer) => {
      const { data: orders } = await supabase
        .from("orders")
        .select("total")
        .eq("user_id", customer.id);

      return {
        ...customer,
        order_count: orders?.length || 0,
        total_spent: (orders || []).reduce((sum, o) => sum + Number(o.total), 0),
      };
    })
  );

  return enriched;
}

export async function getCustomerOrders(customerId: string) {
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", customerId)
    .single();

  const { data: orders } = await supabase
    .from("orders")
    .select("*, items:order_items(*)")
    .eq("user_id", customerId)
    .order("created_at", { ascending: false });

  return { profile, orders: orders || [] };
}

export async function createProduct(formData: FormData) {
  const supabase = await createClient();

  const product = {
    name: formData.get("name") as string,
    slug: (formData.get("name") as string)
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-"),
    description: formData.get("description") as string,
    category_id: (formData.get("category_id") as string) || null,
    base_price: parseFloat(formData.get("base_price") as string),
    compare_at_price: formData.get("compare_at_price")
      ? parseFloat(formData.get("compare_at_price") as string)
      : null,
    is_active: formData.get("is_active") === "on",
    is_featured: formData.get("is_featured") === "on",
  };

  const { data, error } = await supabase
    .from("products")
    .insert(product)
    .select("id")
    .single();

  if (error) return { error: error.message };

  const imagesJson = formData.get("images") as string;
  if (data && imagesJson) {
    const images = JSON.parse(imagesJson) as Array<{
      url: string;
      is_primary: boolean;
      sort_order: number;
    }>;
    if (images.length > 0) {
      await supabase.from("product_images").insert(
        images.map((img) => ({
          product_id: data.id,
          url: img.url,
          is_primary: img.is_primary,
          sort_order: img.sort_order,
        }))
      );
    }
  }

  const variantsJson = formData.get("variants") as string;
  if (data && variantsJson) {
    const variants = JSON.parse(variantsJson) as Array<{
      size: string;
      color: string;
      sku: string;
      price_override: string;
      stock_quantity: string;
      is_active: boolean;
    }>;
    if (variants.length > 0) {
      await supabase.from("product_variants").insert(
        variants.map((v) => ({
          product_id: data.id,
          size: v.size,
          color: v.color,
          sku: v.sku || null,
          price_override: v.price_override ? parseFloat(v.price_override) : null,
          stock_quantity: parseInt(v.stock_quantity) || 0,
          is_active: v.is_active,
        }))
      );
    }
  }

  redirect(`/admin/products`);
}

export async function updateProduct(id: string, formData: FormData) {
  const supabase = await createClient();

  const product = {
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    category_id: (formData.get("category_id") as string) || null,
    base_price: parseFloat(formData.get("base_price") as string),
    compare_at_price: formData.get("compare_at_price")
      ? parseFloat(formData.get("compare_at_price") as string)
      : null,
    is_active: formData.get("is_active") === "on",
    is_featured: formData.get("is_featured") === "on",
  };

  const { error } = await supabase
    .from("products")
    .update(product)
    .eq("id", id);

  if (error) return { error: error.message };

  const imagesJson = formData.get("images") as string;
  if (imagesJson) {
    const images = JSON.parse(imagesJson) as Array<{
      url: string;
      is_primary: boolean;
      sort_order: number;
    }>;

    await supabase.from("product_images").delete().eq("product_id", id);

    if (images.length > 0) {
      await supabase.from("product_images").insert(
        images.map((img) => ({
          product_id: id,
          url: img.url,
          is_primary: img.is_primary,
          sort_order: img.sort_order,
        }))
      );
    }
  }

  const variantsJson = formData.get("variants") as string;
  if (variantsJson) {
    const variants = JSON.parse(variantsJson) as Array<{
      size: string;
      color: string;
      sku: string;
      price_override: string;
      stock_quantity: string;
      is_active: boolean;
    }>;

    await supabase.from("product_variants").delete().eq("product_id", id);

    if (variants.length > 0) {
      await supabase.from("product_variants").insert(
        variants.map((v) => ({
          product_id: id,
          size: v.size,
          color: v.color,
          sku: v.sku || null,
          price_override: v.price_override ? parseFloat(v.price_override) : null,
          stock_quantity: parseInt(v.stock_quantity) || 0,
          is_active: v.is_active,
        }))
      );
    }
  }

  redirect(`/admin/products`);
}

export async function deleteProduct(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}

export async function getAdminCollections() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("collections")
    .select("*")
    .order("sort_order");
  return data || [];
}

export async function createCollection(formData: FormData) {
  const supabase = await createClient();
  const collection = {
    name: formData.get("name") as string,
    slug: (formData.get("name") as string)
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-"),
    description: (formData.get("description") as string) || null,
    image_url: (formData.get("image_url") as string) || null,
    is_active: formData.get("is_active") === "on",
  };

  const { error } = await supabase.from("collections").insert(collection);
  if (error) return { error: error.message };
  return { success: true };
}

export async function updateCollection(id: string, formData: FormData) {
  const supabase = await createClient();
  const updates = {
    name: formData.get("name") as string,
    description: (formData.get("description") as string) || null,
    image_url: (formData.get("image_url") as string) || null,
    is_active: formData.get("is_active") === "on",
  };

  const { error } = await supabase
    .from("collections")
    .update(updates)
    .eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}

export async function deleteCollection(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("collections").delete().eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}

export async function getCollectionProducts(collectionId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("product_collections")
    .select("product_id")
    .eq("collection_id", collectionId);
  return (data || []).map((r) => r.product_id);
}

export async function updateCollectionProducts(collectionId: string, productIds: string[]) {
  const supabase = await createClient();
  await supabase.from("product_collections").delete().eq("collection_id", collectionId);
  if (productIds.length > 0) {
    await supabase.from("product_collections").insert(
      productIds.map((pid) => ({ collection_id: collectionId, product_id: pid }))
    );
  }
  return { success: true };
}

export async function getAdminCategories() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");
  return data || [];
}

export async function createCategory(formData: FormData) {
  const supabase = await createClient();
  const category = {
    name: formData.get("name") as string,
    slug: (formData.get("name") as string)
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-"),
    description: (formData.get("description") as string) || null,
    parent_id: (formData.get("parent_id") as string) || null,
  };

  const { error } = await supabase.from("categories").insert(category);
  if (error) return { error: error.message };
  return { success: true };
}

export async function updateCategory(id: string, formData: FormData) {
  const supabase = await createClient();
  const updates = {
    name: formData.get("name") as string,
    description: (formData.get("description") as string) || null,
    parent_id: (formData.get("parent_id") as string) || null,
  };

  const { error } = await supabase
    .from("categories")
    .update(updates)
    .eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}

export async function saveProductVariants(
  productId: string,
  variants: Array<{
    id?: string;
    size: string;
    color: string;
    sku?: string;
    price_override?: number | null;
    stock_quantity: number;
    is_active: boolean;
  }>
) {
  const supabase = await createClient();

  await supabase.from("product_variants").delete().eq("product_id", productId);

  if (variants.length > 0) {
    const { error } = await supabase.from("product_variants").insert(
      variants.map((v) => ({
        product_id: productId,
        size: v.size,
        color: v.color,
        sku: v.sku || null,
        price_override: v.price_override || null,
        stock_quantity: v.stock_quantity,
        is_active: v.is_active,
      }))
    );
    if (error) return { error: error.message };
  }

  return { success: true };
}

export async function getInventory() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("product_variants")
    .select("*, product:products(name, slug)")
    .order("stock_quantity", { ascending: true });
  return data || [];
}

export async function updateStock(variantId: string, quantity: number) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("product_variants")
    .update({ stock_quantity: quantity })
    .eq("id", variantId);
  if (error) return { error: error.message };
  return { success: true };
}
