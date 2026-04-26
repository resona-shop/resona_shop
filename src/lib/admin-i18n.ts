"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AdminLocale = "zh" | "en";

interface AdminLocaleState {
  locale: AdminLocale;
  setLocale: (locale: AdminLocale) => void;
  toggle: () => void;
}

export const useAdminLocale = create<AdminLocaleState>()(
  persist(
    (set, get) => ({
      locale: "zh",
      setLocale: (locale) => set({ locale }),
      toggle: () => set({ locale: get().locale === "zh" ? "en" : "zh" }),
    }),
    { name: "resona-admin-locale" }
  )
);

const dict = {
  // Layout
  "admin.title": { zh: "管理后台", en: "Admin Dashboard" },

  // Sidebar nav
  "nav.dashboard": { zh: "仪表盘", en: "Dashboard" },
  "nav.products": { zh: "商品管理", en: "Products" },
  "nav.orders": { zh: "订单管理", en: "Orders" },
  "nav.customers": { zh: "客户管理", en: "Customers" },
  "nav.collections": { zh: "合集管理", en: "Collections" },
  "nav.categories": { zh: "分类管理", en: "Categories" },
  "nav.settings": { zh: "系统设置", en: "Settings" },

  // Dashboard
  "dashboard.title": { zh: "仪表盘", en: "Dashboard" },
  "dashboard.totalRevenue": { zh: "总收入", en: "Total Revenue" },
  "dashboard.orders": { zh: "订单数", en: "Orders" },
  "dashboard.products": { zh: "商品数", en: "Products" },
  "dashboard.customers": { zh: "客户数", en: "Customers" },
  "dashboard.recentOrders": { zh: "最近订单", en: "Recent Orders" },
  "dashboard.noOrders": { zh: "暂无订单", en: "No orders yet." },

  // Table headers
  "table.order": { zh: "订单号", en: "Order" },
  "table.date": { zh: "日期", en: "Date" },
  "table.status": { zh: "状态", en: "Status" },
  "table.total": { zh: "金额", en: "Total" },
  "table.product": { zh: "商品", en: "Product" },
  "table.category": { zh: "分类", en: "Category" },
  "table.price": { zh: "价格", en: "Price" },
  "table.variants": { zh: "规格", en: "Variants" },
  "table.actions": { zh: "操作", en: "Actions" },
  "table.customer": { zh: "客户", en: "Customer" },
  "table.items": { zh: "商品数", en: "Items" },
  "table.name": { zh: "名称", en: "Name" },
  "table.slug": { zh: "别名", en: "Slug" },
  "table.email": { zh: "邮箱", en: "Email" },
  "table.phone": { zh: "电话", en: "Phone" },
  "table.joined": { zh: "注册时间", en: "Joined" },

  // Products
  "products.title": { zh: "商品管理", en: "Products" },
  "products.add": { zh: "添加商品", en: "Add Product" },
  "products.search": { zh: "搜索商品...", en: "Search products..." },
  "products.noProducts": { zh: "暂无商品", en: "No products found." },
  "products.edit": { zh: "编辑", en: "Edit" },
  "products.delete": { zh: "删除", en: "Delete" },
  "products.new": { zh: "新建商品", en: "New Product" },
  "products.editTitle": { zh: "编辑商品", en: "Edit Product" },
  "products.active": { zh: "上架", en: "Active" },
  "products.draft": { zh: "草稿", en: "Draft" },
  "products.featured": { zh: "推荐", en: "Featured" },

  // Product form
  "form.name": { zh: "商品名称", en: "Product Name" },
  "form.description": { zh: "描述", en: "Description" },
  "form.price": { zh: "价格 ($)", en: "Price ($)" },
  "form.comparePrice": { zh: "原价 ($)", en: "Compare at Price ($)" },
  "form.category": { zh: "分类", en: "Category" },
  "form.noCategory": { zh: "无分类", en: "No category" },
  "form.isActive": { zh: "上架", en: "Active" },
  "form.isFeatured": { zh: "推荐", en: "Featured" },
  "form.create": { zh: "创建商品", en: "Create Product" },
  "form.update": { zh: "更新商品", en: "Update Product" },

  // Image upload
  "form.images": { zh: "商品图片", en: "Product Images" },
  "form.images.drag": { zh: "拖拽图片到此处，或点击选择", en: "Drag images here, or click to select" },
  "form.images.formats": { zh: "支持 JPG、PNG、WebP，最大 5MB", en: "JPG, PNG, WebP up to 5MB" },
  "form.images.uploading": { zh: "上传中...", en: "Uploading..." },
  "form.images.primary": { zh: "主图", en: "Primary" },
  "form.images.setPrimary": { zh: "设为主图", en: "Set as primary" },
  "form.images.remove": { zh: "删除", en: "Remove" },

  // Orders
  "orders.title": { zh: "订单管理", en: "Orders" },
  "orders.noOrders": { zh: "暂无订单", en: "No orders found." },
  "orders.all": { zh: "全部", en: "all" },
  "orders.updateStatus": { zh: "更新状态", en: "Update Status" },
  "orders.update": { zh: "更新", en: "Update" },
  "orders.customer": { zh: "客户信息", en: "Customer" },
  "orders.shipping": { zh: "收货地址", en: "Shipping Address" },
  "orders.items": { zh: "商品明细", en: "Items" },
  "orders.qty": { zh: "数量", en: "Qty" },
  "orders.subtotal": { zh: "小计", en: "Subtotal" },
  "orders.shippingCost": { zh: "运费", en: "Shipping" },
  "orders.tax": { zh: "税费", en: "Tax" },
  "orders.guest": { zh: "游客", en: "Guest" },
  "orders.search": { zh: "搜索订单号...", en: "Search order number..." },
  "orders.back": { zh: "返回订单列表", en: "Back to Orders" },
  "orders.notes": { zh: "订单备注", en: "Order Notes" },
  "orders.notesPlaceholder": { zh: "添加备注...", en: "Add a note..." },
  "orders.saveNotes": { zh: "保存备注", en: "Save Notes" },
  "orders.payment": { zh: "支付信息", en: "Payment Info" },
  "orders.stripeSession": { zh: "Stripe 会话", en: "Stripe Session" },
  "orders.paymentIntent": { zh: "支付意向", en: "Payment Intent" },
  "orders.createdAt": { zh: "下单时间", en: "Placed at" },
  "orders.updatedAt": { zh: "更新时间", en: "Updated at" },
  "orders.sortNewest": { zh: "最新优先", en: "Newest First" },
  "orders.sortOldest": { zh: "最早优先", en: "Oldest First" },
  "orders.sortTotalDesc": { zh: "金额从高到低", en: "Amount: High to Low" },
  "orders.sortTotalAsc": { zh: "金额从低到高", en: "Amount: Low to High" },
  "orders.page": { zh: "页", en: "Page" },
  "orders.of": { zh: "共", en: "of" },
  "orders.prev": { zh: "上一页", en: "Previous" },
  "orders.next": { zh: "下一页", en: "Next" },
  "orders.showing": { zh: "显示", en: "Showing" },
  "orders.results": { zh: "条结果", en: "results" },
  "orders.sort": { zh: "排序", en: "Sort" },
  "orders.tracking": { zh: "物流信息", en: "Shipping & Tracking" },
  "orders.carrier": { zh: "快递公司", en: "Carrier" },
  "orders.carrierPlaceholder": { zh: "如：顺丰、DHL、FedEx", en: "e.g. DHL, FedEx, UPS" },
  "orders.trackingNumber": { zh: "快递单号", en: "Tracking Number" },
  "orders.trackingPlaceholder": { zh: "输入快递单号", en: "Enter tracking number" },
  "orders.markShipped": { zh: "标记发货", en: "Mark as Shipped" },
  "orders.markDelivered": { zh: "标记送达", en: "Mark as Delivered" },
  "orders.shippedAt": { zh: "发货时间", en: "Shipped at" },
  "orders.deliveredAt": { zh: "送达时间", en: "Delivered at" },
  "orders.saveTracking": { zh: "保存物流信息", en: "Save Tracking" },
  "orders.editOrder": { zh: "编辑订单", en: "Edit Order" },
  "orders.editAddress": { zh: "修改收货地址", en: "Edit Shipping Address" },
  "orders.saveAddress": { zh: "保存地址", en: "Save Address" },
  "orders.editAmounts": { zh: "调整金额", en: "Adjust Amounts" },
  "orders.saveAmounts": { zh: "保存金额", en: "Save Amounts" },
  "orders.noTracking": { zh: "暂无物流信息", en: "No tracking info yet" },
  "orders.viewDetail": { zh: "查看详情", en: "View Detail" },

  // Order statuses
  "status.pending": { zh: "待处理", en: "Pending" },
  "status.confirmed": { zh: "已确认", en: "Confirmed" },
  "status.processing": { zh: "处理中", en: "Processing" },
  "status.shipped": { zh: "已发货", en: "Shipped" },
  "status.delivered": { zh: "已送达", en: "Delivered" },
  "status.cancelled": { zh: "已取消", en: "Cancelled" },
  "status.refunded": { zh: "已退款", en: "Refunded" },
  "status.refund_requested": { zh: "退款申请中", en: "Refund Requested" },

  // Refund actions
  "orders.approveRefund": { zh: "批准退款", en: "Approve Refund" },
  "orders.rejectRefund": { zh: "拒绝退款", en: "Reject Refund" },
  "orders.refundApproved": { zh: "退款已批准", en: "Refund approved" },
  "orders.refundRejected": { zh: "退款已拒绝", en: "Refund rejected" },
  "orders.refundFailed": { zh: "退款失败", en: "Refund failed" },
  "orders.refundConfirm": { zh: "确认批准此订单的退款申请？将通过 Stripe 退款给客户。", en: "Approve refund for this order? This will refund the customer via Stripe." },
  "orders.rejectConfirm": { zh: "确认拒绝此退款申请？订单将恢复为已确认状态。", en: "Reject this refund request? The order will be restored to confirmed status." },

  // Customers
  "customers.title": { zh: "客户管理", en: "Customers" },
  "customers.noCustomers": { zh: "暂无客户", en: "No customers yet." },
  "customers.search": { zh: "搜索客户...", en: "Search customers..." },
  "customers.totalOrders": { zh: "订单数", en: "Orders" },
  "customers.totalSpent": { zh: "消费总额", en: "Total Spent" },
  "customers.viewOrders": { zh: "查看订单", en: "View Orders" },
  "customers.orderHistory": { zh: "订单历史", en: "Order History" },
  "customers.noOrders": { zh: "该客户暂无订单", en: "No orders from this customer." },
  "customers.backToList": { zh: "返回客户列表", en: "Back to Customers" },

  // Collections
  "collections.title": { zh: "合集管理", en: "Collections" },
  "collections.noCollections": { zh: "暂无合集", en: "No collections yet." },
  "collections.new": { zh: "新建合集", en: "New Collection" },
  "collections.create": { zh: "创建合集", en: "Create Collection" },
  "collections.active": { zh: "启用", en: "Active" },
  "collections.inactive": { zh: "停用", en: "Inactive" },
  "collections.edit": { zh: "编辑", en: "Edit" },
  "collections.delete": { zh: "删除", en: "Delete" },
  "collections.update": { zh: "更新合集", en: "Update Collection" },
  "collections.editing": { zh: "编辑合集", en: "Edit Collection" },
  "collections.products": { zh: "分配商品", en: "Assign Products" },
  "collections.productsDesc": { zh: "勾选要加入此合集的商品", en: "Select products for this collection" },
  "collections.saveProducts": { zh: "保存分配", en: "Save Assignment" },

  // Categories
  "categories.edit": { zh: "编辑", en: "Edit" },
  "categories.update": { zh: "更新分类", en: "Update Category" },
  "categories.editing": { zh: "编辑分类", en: "Edit Category" },

  // Settings
  "settings.title": { zh: "系统设置", en: "Store Settings" },
  "settings.storeName": { zh: "店铺名称", en: "Store Name" },
  "settings.currency": { zh: "货币", en: "Currency" },
  "settings.freeShipping": { zh: "免运费门槛", en: "Free Shipping Threshold" },
  "settings.shippingRate": { zh: "默认运费", en: "Default Shipping Rate" },
  "settings.stripe": { zh: "Stripe 集成", en: "Stripe Integration" },
  "settings.connected": { zh: "已连接", en: "Connected" },
  "settings.notConfigured": { zh: "未配置", en: "Not configured" },

  // Common
  "common.total": { zh: "合计", en: "Total" },
  "common.locale.zh": { zh: "中", en: "中" },
  "common.locale.en": { zh: "EN", en: "EN" },
  "common.delete": { zh: "删除", en: "Delete" },
  "common.save": { zh: "保存", en: "Save" },
  "common.add": { zh: "添加", en: "Add" },

  // Categories
  "categories.title": { zh: "分类管理", en: "Categories" },
  "categories.noCategories": { zh: "暂无分类", en: "No categories yet." },
  "categories.new": { zh: "新建分类", en: "New Category" },
  "categories.create": { zh: "创建分类", en: "Create Category" },
  "categories.parent": { zh: "父分类", en: "Parent Category" },
  "categories.noParent": { zh: "无（顶级分类）", en: "None (top level)" },

  // Variants
  "variants.title": { zh: "商品规格", en: "Product Variants" },
  "variants.size": { zh: "尺码", en: "Size" },
  "variants.color": { zh: "颜色", en: "Color" },
  "variants.sku": { zh: "SKU", en: "SKU" },
  "variants.stock": { zh: "库存", en: "Stock" },
  "variants.priceOverride": { zh: "特殊价格", en: "Price Override" },
  "variants.active": { zh: "启用", en: "Active" },
  "variants.add": { zh: "添加规格", en: "Add Variant" },
  "variants.empty": { zh: "暂无规格，请添加", en: "No variants yet. Add one." },

  // Inventory
  "nav.inventory": { zh: "库存管理", en: "Inventory" },
  "inventory.title": { zh: "库存管理", en: "Inventory" },
  "inventory.product": { zh: "商品", en: "Product" },
  "inventory.variant": { zh: "规格", en: "Variant" },
  "inventory.stock": { zh: "库存数量", en: "Stock" },
  "inventory.status": { zh: "状态", en: "Status" },
  "inventory.inStock": { zh: "有货", en: "In Stock" },
  "inventory.lowStock": { zh: "低库存", en: "Low Stock" },
  "inventory.outOfStock": { zh: "缺货", en: "Out of Stock" },
  "inventory.update": { zh: "更新", en: "Update" },
  "inventory.noItems": { zh: "暂无库存数据", en: "No inventory data." },
  "dashboard.lowStock": { zh: "低库存预警", en: "Low Stock" },
} as const;

type DictKey = keyof typeof dict;

export function useT() {
  const locale = useAdminLocale((s) => s.locale);
  return (key: DictKey) => dict[key][locale];
}

export function getStatusLabel(status: string, locale: AdminLocale) {
  const key = `status.${status}` as DictKey;
  return dict[key]?.[locale] || status;
}
