export const siteConfig = {
  name: "Resona",
  description:
    "Southeast Asian casual fashion for the confident, effortless woman.",
  slogan: "Ease That Resonates",
  taglines: [
    "Ease That Resonates",
    "Where Confidence Echoes",
    "Effortless Resonance",
  ],
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  currency: "USD",
  locale: "en-US",
} as const;

export const navItems = [
  { label: "New Arrivals", href: "/collections/new-arrivals" },
  { label: "Shop All", href: "/products" },
  { label: "Collections", href: "/collections" },
  { label: "About", href: "/about" },
] as const;

export const adminNavItems = [
  { label: "Dashboard", href: "/admin", icon: "LayoutDashboard" },
  { label: "Products", href: "/admin/products", icon: "Package" },
  { label: "Orders", href: "/admin/orders", icon: "ShoppingBag" },
  { label: "Customers", href: "/admin/customers", icon: "Users" },
  { label: "Collections", href: "/admin/collections", icon: "Layers" },
  { label: "Settings", href: "/admin/settings", icon: "Settings" },
] as const;

export const ORDER_STATUSES = {
  pending: { label: "Pending", color: "bg-amber-100 text-amber-800" },
  confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-800" },
  processing: { label: "Processing", color: "bg-indigo-100 text-indigo-800" },
  shipped: { label: "Shipped", color: "bg-purple-100 text-purple-800" },
  delivered: { label: "Delivered", color: "bg-green-100 text-green-800" },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800" },
  refunded: { label: "Refunded", color: "bg-gray-100 text-gray-800" },
} as const;

export const SIZES = ["XS", "S", "M", "L", "XL"] as const;

export const COUNTRIES = [
  { code: "SG", name: "Singapore" },
  { code: "MY", name: "Malaysia" },
  { code: "TH", name: "Thailand" },
  { code: "ID", name: "Indonesia" },
  { code: "PH", name: "Philippines" },
  { code: "VN", name: "Vietnam" },
  { code: "US", name: "United States" },
] as const;
