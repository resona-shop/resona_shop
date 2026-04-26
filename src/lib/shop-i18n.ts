"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ShopLocale = "en" | "vi";

interface ShopLocaleState {
  locale: ShopLocale;
  setLocale: (locale: ShopLocale) => void;
  toggle: () => void;
}

export const useShopLocale = create<ShopLocaleState>()(
  persist(
    (set, get) => ({
      locale: "en",
      setLocale: (locale) => set({ locale }),
      toggle: () => set({ locale: get().locale === "en" ? "vi" : "en" }),
    }),
    { name: "resona-shop-locale" }
  )
);

const dict = {
  // Nav
  "nav.newArrivals": { en: "New Arrivals", vi: "Hàng Mới" },
  "nav.shopAll": { en: "Shop All", vi: "Tất Cả" },
  "nav.collections": { en: "Collections", vi: "Bộ Sưu Tập" },
  "nav.about": { en: "About", vi: "Giới Thiệu" },

  // Header / Search
  "search.placeholder": { en: "Search products...", vi: "Tìm kiếm sản phẩm..." },
  "search.title": { en: "Search products", vi: "Tìm kiếm sản phẩm" },

  // Announcement
  "announce.freeShipping": { en: "Free shipping on orders over $80 — Southeast Asia & worldwide", vi: "Miễn phí vận chuyển cho đơn hàng trên $80 — Đông Nam Á & toàn cầu" },

  // Hero
  "hero.tagline": { en: "Where Confidence Echoes", vi: "Nơi Sự Tự Tin Vang Vọng" },
  "hero.title1": { en: "Ease That", vi: "Sự Thoải Mái" },
  "hero.title2": { en: "Resonates", vi: "Cộng Hưởng" },
  "hero.subtitle": { en: "Casual fashion for the confident woman. Born under Southeast Asian golden skies, designed for effortless radiance everywhere you go.", vi: "Thời trang casual cho phụ nữ tự tin. Sinh ra dưới bầu trời vàng Đông Nam Á, thiết kế cho sự tỏa sáng tự nhiên mọi nơi bạn đến." },
  "hero.shopNow": { en: "Shop Now", vi: "Mua Ngay" },
  "hero.newArrivals": { en: "New Arrivals", vi: "Hàng Mới" },

  // Featured
  "featured.tagline": { en: "Curated For You", vi: "Dành Riêng Cho Bạn" },
  "featured.title": { en: "Featured Picks", vi: "Sản Phẩm Nổi Bật" },
  "featured.viewAll": { en: "View All", vi: "Xem Tất Cả" },
  "featured.viewAllProducts": { en: "View All Products", vi: "Xem Tất Cả Sản Phẩm" },

  // Collections
  "collections.tagline": { en: "Explore", vi: "Khám Phá" },
  "collections.title": { en: "Collections", vi: "Bộ Sưu Tập" },
  "collections.shopNow": { en: "Shop Now", vi: "Mua Ngay" },
  "collections.explore": { en: "Explore", vi: "Khám Phá" },
  "collections.subtitle": { en: "Curated edits for every mood and moment.", vi: "Bộ sưu tập cho mọi tâm trạng và khoảnh khắc." },
  "collections.comingSoon": { en: "Collections coming soon.", vi: "Bộ sưu tập sắp ra mắt." },

  // Brand Story
  "brand.tagline": { en: "Our Philosophy", vi: "Triết Lý Của Chúng Tôi" },
  "brand.title1": { en: "Fashion should feel like", vi: "Thời trang nên giống như" },
  "brand.goldenHour": { en: "golden hour", vi: "giờ vàng" },
  "brand.title2": { en: "— warm, effortless, and undeniably", vi: "— ấm áp, tự nhiên, và không thể phủ nhận" },
  "brand.you": { en: "you", vi: "là bạn" },
  "brand.story": { en: "Resona was born in Southeast Asia, where the sun paints everything in warm amber and confidence comes naturally. We design for women who don't try to stand out — they just do. Every piece carries that effortless resonance: the ease of a tropical breeze, the glow of golden light on skin.", vi: "Resona ra đời tại Đông Nam Á, nơi ánh nắng nhuộm mọi thứ trong sắc hổ phách ấm áp và sự tự tin đến tự nhiên. Chúng tôi thiết kế cho những phụ nữ không cố gắng nổi bật — họ tự nhiên như vậy. Mỗi sản phẩm mang theo sự cộng hưởng tự nhiên: sự dễ chịu của gió nhiệt đới, ánh sáng vàng trên làn da." },
  "brand.sustainable": { en: "Sustainable Fabrics", vi: "Vải Bền Vững" },
  "brand.born": { en: "Born & Designed", vi: "Thiết Kế Tại" },
  "brand.sizing": { en: "Inclusive Sizing", vi: "Đa Dạng Size" },

  // Newsletter
  "newsletter.title": { en: "Stay in the Glow", vi: "Luôn Tỏa Sáng" },
  "newsletter.subtitle": { en: "Be the first to know about new arrivals, exclusive offers, and Resona stories. No spam — just warmth.", vi: "Là người đầu tiên biết về hàng mới, ưu đãi độc quyền và câu chuyện Resona. Không spam — chỉ có sự ấm áp." },
  "newsletter.placeholder": { en: "Your email address", vi: "Địa chỉ email của bạn" },
  "newsletter.subscribe": { en: "Subscribe", vi: "Đăng Ký" },
  "newsletter.success": { en: "Welcome to the Resona family!", vi: "Chào mừng bạn đến với gia đình Resona!" },

  // Products
  "products.title": { en: "Shop All", vi: "Tất Cả Sản Phẩm" },
  "products.subtitle": { en: "Discover pieces that resonate with your style.", vi: "Khám phá những sản phẩm cộng hưởng với phong cách của bạn." },
  "products.all": { en: "All", vi: "Tất Cả" },
  "products.newest": { en: "Newest", vi: "Mới Nhất" },
  "products.priceLow": { en: "Price: Low to High", vi: "Giá: Thấp đến Cao" },
  "products.priceHigh": { en: "Price: High to Low", vi: "Giá: Cao đến Thấp" },
  "products.noProducts": { en: "No products found.", vi: "Không tìm thấy sản phẩm." },
  "products.results": { en: "Results for", vi: "Kết quả cho" },
  "products.quickAdd": { en: "Quick Add", vi: "Thêm Nhanh" },
  "products.sale": { en: "Sale", vi: "Giảm Giá" },

  // Product Detail
  "product.color": { en: "Color", vi: "Màu" },
  "product.size": { en: "Size", vi: "Kích Cỡ" },
  "product.addToCart": { en: "Add to Cart", vi: "Thêm Vào Giỏ" },
  "product.added": { en: "Added!", vi: "Đã Thêm!" },
  "product.outOfStock": { en: "Out of Stock", vi: "Hết Hàng" },
  "product.onlyLeft": { en: "Only {n} left in stock", vi: "Chỉ còn {n} sản phẩm" },
  "product.off": { en: "off", vi: "giảm" },

  // Reviews
  "reviews.title": { en: "Reviews", vi: "Đánh Giá" },
  "reviews.write": { en: "Write a Review", vi: "Viết Đánh Giá" },
  "reviews.rating": { en: "Rating", vi: "Xếp Hạng" },
  "reviews.reviewTitle": { en: "Title", vi: "Tiêu Đề" },
  "reviews.reviewTitlePlaceholder": { en: "Summary of your review", vi: "Tóm tắt đánh giá" },
  "reviews.reviewBody": { en: "Review", vi: "Đánh Giá" },
  "reviews.reviewBodyPlaceholder": { en: "Share your experience...", vi: "Chia sẻ trải nghiệm..." },
  "reviews.submit": { en: "Submit Review", vi: "Gửi Đánh Giá" },
  "reviews.submitting": { en: "Submitting...", vi: "Đang gửi..." },
  "reviews.empty": { en: "No reviews yet. Be the first to share your experience.", vi: "Chưa có đánh giá. Hãy là người đầu tiên chia sẻ." },

  // Cart
  "cart.title": { en: "Your Cart", vi: "Giỏ Hàng" },
  "cart.empty": { en: "Your cart is empty", vi: "Giỏ hàng trống" },
  "cart.emptySubtitle": { en: "Discover pieces that resonate with your style.", vi: "Khám phá những sản phẩm phù hợp với phong cách của bạn." },
  "cart.startShopping": { en: "Start Shopping", vi: "Bắt Đầu Mua Sắm" },
  "cart.orderSummary": { en: "Order Summary", vi: "Tóm Tắt Đơn Hàng" },
  "cart.subtotal": { en: "Subtotal", vi: "Tạm Tính" },
  "cart.shipping": { en: "Shipping", vi: "Vận Chuyển" },
  "cart.free": { en: "Free", vi: "Miễn Phí" },
  "cart.freeShippingNote": { en: "Free shipping on orders over $80", vi: "Miễn phí vận chuyển cho đơn trên $80" },
  "cart.total": { en: "Total", vi: "Tổng Cộng" },
  "cart.checkout": { en: "Proceed to Checkout", vi: "Tiến Hành Thanh Toán" },
  "cart.continueShopping": { en: "Continue Shopping", vi: "Tiếp Tục Mua Sắm" },
  "cart.items": { en: "items", vi: "sản phẩm" },

  // Checkout
  "checkout.title": { en: "Checkout", vi: "Thanh Toán" },
  "checkout.review": { en: "Order Review", vi: "Xem Lại Đơn Hàng" },
  "checkout.subtotal": { en: "Subtotal", vi: "Tạm Tính" },
  "checkout.shippingNote": { en: "Shipping and taxes calculated at checkout.", vi: "Phí vận chuyển và thuế sẽ được tính khi thanh toán." },
  "checkout.pay": { en: "Pay with Stripe", vi: "Thanh Toán qua Stripe" },
  "checkout.redirecting": { en: "Redirecting to payment...", vi: "Đang chuyển đến trang thanh toán..." },

  // Checkout Success
  "success.title": { en: "Thank You!", vi: "Cảm Ơn Bạn!" },
  "success.order": { en: "Order", vi: "Đơn hàng" },
  "success.message": { en: "Your order has been confirmed. We'll send you an email with your order details and tracking information once your items ship.", vi: "Đơn hàng của bạn đã được xác nhận. Chúng tôi sẽ gửi email với chi tiết đơn hàng và thông tin vận chuyển khi hàng được gửi đi." },
  "success.confirming": { en: "Confirming your order...", vi: "Đang xác nhận đơn hàng..." },
  "success.viewOrders": { en: "View Orders", vi: "Xem Đơn Hàng" },
  "success.continueShopping": { en: "Continue Shopping", vi: "Tiếp Tục Mua Sắm" },

  // Auth
  "auth.signIn": { en: "Sign In", vi: "Đăng Nhập" },
  "auth.signUp": { en: "Create Account", vi: "Tạo Tài Khoản" },
  "auth.signInSubtitle": { en: "Welcome back. Sign in to continue.", vi: "Chào mừng trở lại. Đăng nhập để tiếp tục." },
  "auth.signUpSubtitle": { en: "Create your account to get started.", vi: "Tạo tài khoản để bắt đầu." },
  "auth.fullName": { en: "Full Name", vi: "Họ Tên" },
  "auth.email": { en: "Email", vi: "Email" },
  "auth.password": { en: "Password", vi: "Mật Khẩu" },
  "auth.forgotPassword": { en: "Forgot password?", vi: "Quên mật khẩu?" },
  "auth.forgotSubtitle": { en: "Enter your email and we'll send you a reset link.", vi: "Nhập email và chúng tôi sẽ gửi link đặt lại mật khẩu." },
  "auth.sendResetLink": { en: "Send Reset Link", vi: "Gửi Link Đặt Lại" },
  "auth.resetSent": { en: "Check your email for a password reset link.", vi: "Kiểm tra email để nhận link đặt lại mật khẩu." },
  "auth.backToLogin": { en: "Back to Sign In", vi: "Quay Lại Đăng Nhập" },
  "auth.resetPassword": { en: "Reset Password", vi: "Đặt Lại Mật Khẩu" },
  "auth.resetSubtitle": { en: "Enter your new password.", vi: "Nhập mật khẩu mới của bạn." },
  "auth.newPassword": { en: "New Password", vi: "Mật Khẩu Mới" },
  "auth.confirmPassword": { en: "Confirm Password", vi: "Xác Nhận Mật Khẩu" },
  "auth.updatePassword": { en: "Update Password", vi: "Cập Nhật Mật Khẩu" },
  "auth.passwordMismatch": { en: "Passwords do not match.", vi: "Mật khẩu không khớp." },
  "auth.noAccount": { en: "Don't have an account?", vi: "Chưa có tài khoản?" },
  "auth.hasAccount": { en: "Already have an account?", vi: "Đã có tài khoản?" },

  // User menu
  "user.account": { en: "Account", vi: "Tài Khoản" },
  "user.orders": { en: "Orders", vi: "Đơn Hàng" },
  "user.addresses": { en: "Addresses", vi: "Địa Chỉ" },
  "user.settings": { en: "Settings", vi: "Cài Đặt" },
  "user.signOut": { en: "Sign Out", vi: "Đăng Xuất" },

  // Account pages
  "account.title": { en: "My Account", vi: "Tài Khoản" },
  "account.welcome": { en: "Welcome back,", vi: "Chào mừng trở lại," },
  "account.orders": { en: "Orders", vi: "Đơn Hàng" },
  "account.addresses": { en: "Addresses", vi: "Địa Chỉ" },
  "account.wishlist": { en: "Wishlist", vi: "Yêu Thích" },
  "account.recentOrders": { en: "Recent Orders", vi: "Đơn Hàng Gần Đây" },
  "account.viewAll": { en: "View all", vi: "Xem tất cả" },
  "account.noOrders": { en: "No orders yet.", vi: "Chưa có đơn hàng." },
  "account.startShopping": { en: "Start shopping", vi: "Bắt đầu mua sắm" },
  "account.overview": { en: "Overview", vi: "Tổng Quan" },
  "account.settings": { en: "Settings", vi: "Cài Đặt" },
  "account.orderHistory": { en: "Order History", vi: "Lịch Sử Đơn Hàng" },
  "account.noOrdersYet": { en: "You haven't placed any orders yet.", vi: "Bạn chưa có đơn hàng nào." },
  "account.savedAddresses": { en: "Saved Addresses", vi: "Địa Chỉ Đã Lưu" },
  "account.addAddress": { en: "Add New Address", vi: "Thêm Địa Chỉ Mới" },
  "account.default": { en: "Default", vi: "Mặc Định" },
  "account.accountSettings": { en: "Account Settings", vi: "Cài Đặt Tài Khoản" },

  // Footer
  "footer.shop": { en: "Shop", vi: "Mua Sắm" },
  "footer.help": { en: "Help", vi: "Hỗ Trợ" },
  "footer.company": { en: "Company", vi: "Công Ty" },
  "footer.brand": { en: "Ease That Resonates. Casual fashion for the confident woman, born under Southeast Asian golden skies.", vi: "Sự Thoải Mái Cộng Hưởng. Thời trang casual cho phụ nữ tự tin, sinh ra dưới bầu trời vàng Đông Nam Á." },
  "footer.newArrivals": { en: "New Arrivals", vi: "Hàng Mới" },
  "footer.bestSellers": { en: "Best Sellers", vi: "Bán Chạy" },
  "footer.shopAll": { en: "Shop All", vi: "Tất Cả" },
  "footer.collections": { en: "Collections", vi: "Bộ Sưu Tập" },
  "footer.shipping": { en: "Shipping & Returns", vi: "Vận Chuyển & Đổi Trả" },
  "footer.sizeGuide": { en: "Size Guide", vi: "Hướng Dẫn Size" },
  "footer.faq": { en: "FAQ", vi: "Câu Hỏi Thường Gặp" },
  "footer.contact": { en: "Contact Us", vi: "Liên Hệ" },
  "footer.about": { en: "About Resona", vi: "Về Resona" },
  "footer.story": { en: "Our Story", vi: "Câu Chuyện" },
  "footer.sustainability": { en: "Sustainability", vi: "Bền Vững" },
  "footer.careers": { en: "Careers", vi: "Tuyển Dụng" },
  "footer.rights": { en: "All rights reserved.", vi: "Bảo lưu mọi quyền." },
  "footer.privacy": { en: "Privacy Policy", vi: "Chính Sách Bảo Mật" },
  "footer.terms": { en: "Terms of Service", vi: "Điều Khoản Dịch Vụ" },

  // Product names (by slug)
  "product.sunset-wrap-dress.name": { en: "Sunset Wrap Dress", vi: "Đầm Quấn Hoàng Hôn" },
  "product.sunset-wrap-dress.desc": { en: "", vi: "Đầm quấn bay bổng với tông san hô ấm áp. Người bạn đồng hành hoàn hảo cho giờ vàng — chất liệu nhẹ, rủ đẹp và bay theo gió." },
  "product.golden-hour-crop-top.name": { en: "Golden Hour Crop Top", vi: "Áo Croptop Giờ Vàng" },
  "product.golden-hour-crop-top.desc": { en: "", vi: "Áo croptop dáng rộng màu xoài mềm mại. Hơi ngắn với dáng hộp — kết hợp hoàn hảo với quần cạp cao." },
  "product.coral-breeze-midi-skirt.name": { en: "Coral Breeze Midi Skirt", vi: "Chân Váy Midi San Hô" },
  "product.coral-breeze-midi-skirt.desc": { en: "", vi: "Chân váy midi dáng chữ A với đường xẻ tinh tế. Lưng thun thoải mái. Tông san hô ấm bắt sáng đẹp." },
  "product.tropical-linen-set.name": { en: "Tropical Linen Co-ord Set", vi: "Set Linen Nhiệt Đới" },
  "product.tropical-linen-set.desc": { en: "", vi: "Set linen hai mảnh: áo sơ mi cài nút và quần ống rộng. Chất linen tự nhiên tông cát ấm." },
  "product.guava-slip-dress.name": { en: "Guava Slip Dress", vi: "Đầm Suông Ổi Hồng" },
  "product.guava-slip-dress.desc": { en: "", vi: "Đầm suông lụa màu ổi hồng nhẹ nhàng. Dây mảnh và cắt chéo ôm nhẹ cơ thể." },
  "product.sand-dune-wide-pants.name": { en: "Sand Dune Wide Pants", vi: "Quần Ống Rộng Cát" },
  "product.sand-dune-wide-pants.desc": { en: "", vi: "Quần ống rộng cạp cao tông cát nướng. Bay bổng, thoáng mát với nếp gấp phía trước." },
  "product.amber-glow-halter-top.name": { en: "Amber Glow Halter Top", vi: "Áo Yếm Hổ Phách" },
  "product.amber-glow-halter-top.desc": { en: "", vi: "Áo yếm cổ với lớp ánh nhẹ. Buộc sau lưng điều chỉnh vừa vặn. Tông hổ phách bắt sáng giờ vàng." },
  "product.emerald-breeze-shorts.name": { en: "Emerald Breeze Shorts", vi: "Quần Short Ngọc Lục" },
  "product.emerald-breeze-shorts.desc": { en: "", vi: "Quần short linen thoải mái màu ngọc lục nhẹ. Lưng thun với dây rút." },

  // Collection names (by slug)
  "collection.new-arrivals.name": { en: "New Arrivals", vi: "Hàng Mới Về" },
  "collection.new-arrivals.desc": { en: "Just dropped — fresh styles for the season", vi: "Vừa ra mắt — phong cách mới cho mùa này" },
  "collection.best-sellers.name": { en: "Best Sellers", vi: "Bán Chạy Nhất" },
  "collection.best-sellers.desc": { en: "Our most-loved pieces", vi: "Những sản phẩm được yêu thích nhất" },
  "collection.summer-glow.name": { en: "Summer Glow", vi: "Ánh Hè Rực Rỡ" },
  "collection.summer-glow.desc": { en: "Sun-kissed essentials for warm days", vi: "Những món đồ thiết yếu cho ngày nắng ấm" },
  "collection.resort-edit.name": { en: "Resort Edit", vi: "Phong Cách Nghỉ Dưỡng" },
  "collection.resort-edit.desc": { en: "Vacation-ready pieces", vi: "Sẵn sàng cho kỳ nghỉ" },

  // Category names (by slug)
  "category.dresses.name": { en: "Dresses", vi: "Đầm" },
  "category.tops.name": { en: "Tops", vi: "Áo" },
  "category.bottoms.name": { en: "Bottoms", vi: "Quần & Chân Váy" },
  "category.sets.name": { en: "Sets", vi: "Set Đồ" },

  // About page
  "about.title": { en: "About Resona", vi: "Về Resona" },
  "about.p1": { en: "Resona was born under the golden skies of Southeast Asia — where warmth isn't just a temperature, it's a feeling. We create casual fashion for women who radiate confidence without trying.", vi: "Resona ra đời dưới bầu trời vàng của Đông Nam Á — nơi sự ấm áp không chỉ là nhiệt độ, mà là một cảm giác. Chúng tôi tạo ra thời trang casual cho những phụ nữ tỏa sáng tự tin mà không cần cố gắng." },
  "about.p2": { en: "Our name comes from \"resonance\" — that effortless echo of self-assurance that follows you into every room. We believe style should feel like golden hour: warm, natural, and undeniably you.", vi: "Tên của chúng tôi bắt nguồn từ \"cộng hưởng\" — tiếng vang tự nhiên của sự tự tin theo bạn vào mọi nơi. Chúng tôi tin rằng phong cách nên giống như giờ vàng: ấm áp, tự nhiên, và không thể phủ nhận là bạn." },
  "about.mission": { en: "Our Mission", vi: "Sứ Mệnh" },
  "about.missionText": { en: "To design clothes that make every woman feel like she's walking through her own golden hour — confident, relaxed, and glowing from within.", vi: "Thiết kế quần áo khiến mọi phụ nữ cảm thấy như đang bước qua giờ vàng của riêng mình — tự tin, thoải mái, và tỏa sáng từ bên trong." },
  "about.madeIn": { en: "Made in Southeast Asia", vi: "Sản Xuất Tại Đông Nam Á" },
  "about.madeInText": { en: "Every piece is designed and crafted in Southeast Asia, working with local artisans and sustainable manufacturers. We're proud of our roots and committed to ethical production.", vi: "Mỗi sản phẩm được thiết kế và sản xuất tại Đông Nam Á, hợp tác với nghệ nhân địa phương và nhà sản xuất bền vững. Chúng tôi tự hào về nguồn gốc và cam kết sản xuất có đạo đức." },

  // Shipping page
  "shipping.title": { en: "Shipping & Returns", vi: "Vận Chuyển & Đổi Trả" },
  "shipping.shippingTitle": { en: "Shipping", vi: "Vận Chuyển" },
  "shipping.s1": { en: "Free standard shipping on orders over $80", vi: "Miễn phí vận chuyển tiêu chuẩn cho đơn trên $80" },
  "shipping.s2": { en: "Standard shipping (5–10 business days): $9.99", vi: "Vận chuyển tiêu chuẩn (5–10 ngày làm việc): $9.99" },
  "shipping.s3": { en: "Express shipping (2–4 business days): $19.99", vi: "Vận chuyển nhanh (2–4 ngày làm việc): $19.99" },
  "shipping.s4": { en: "We ship to Singapore, Malaysia, Thailand, Indonesia, Philippines, Vietnam, US, UK, and Australia", vi: "Chúng tôi giao hàng đến Singapore, Malaysia, Thái Lan, Indonesia, Philippines, Việt Nam, Mỹ, Anh và Úc" },
  "shipping.returnsTitle": { en: "Returns", vi: "Đổi Trả" },
  "shipping.r1": { en: "30-day return policy for unworn items with tags attached", vi: "Chính sách đổi trả 30 ngày cho sản phẩm chưa mặc còn nguyên tag" },
  "shipping.r2": { en: "Free returns for orders within Southeast Asia", vi: "Miễn phí đổi trả cho đơn hàng trong Đông Nam Á" },
  "shipping.r3": { en: "International returns: customer covers return shipping", vi: "Đổi trả quốc tế: khách hàng chịu phí vận chuyển" },
  "shipping.r4": { en: "Refunds processed within 5–7 business days after we receive the item", vi: "Hoàn tiền trong 5–7 ngày làm việc sau khi nhận được hàng" },
  "shipping.exchangeTitle": { en: "Exchanges", vi: "Đổi Hàng" },
  "shipping.exchangeText": { en: "Need a different size? Contact us at support@resona.com and we'll arrange an exchange at no extra cost.", vi: "Cần đổi size? Liên hệ support@resona.com và chúng tôi sẽ đổi miễn phí." },

  // Size Guide
  "sizeGuide.title": { en: "Size Guide", vi: "Hướng Dẫn Chọn Size" },
  "sizeGuide.intro": { en: "All measurements are in centimeters. If you're between sizes, we recommend sizing up for a relaxed fit.", vi: "Tất cả số đo tính bằng cm. Nếu bạn ở giữa hai size, chúng tôi khuyên chọn size lớn hơn." },
  "sizeGuide.size": { en: "Size", vi: "Size" },
  "sizeGuide.bust": { en: "Bust (cm)", vi: "Ngực (cm)" },
  "sizeGuide.waist": { en: "Waist (cm)", vi: "Eo (cm)" },
  "sizeGuide.hips": { en: "Hips (cm)", vi: "Hông (cm)" },
  "sizeGuide.help": { en: "Need help? Contact us at support@resona.com", vi: "Cần hỗ trợ? Liên hệ support@resona.com" },

  // FAQ
  "faq.title": { en: "Frequently Asked Questions", vi: "Câu Hỏi Thường Gặp" },
  "faq.q1": { en: "What is Resona's return policy?", vi: "Chính sách đổi trả của Resona?" },
  "faq.a1": { en: "We offer a 30-day return policy for unworn items with tags attached. Free returns within Southeast Asia.", vi: "Chúng tôi có chính sách đổi trả 30 ngày cho sản phẩm chưa mặc còn nguyên tag. Miễn phí đổi trả trong Đông Nam Á." },
  "faq.q2": { en: "How long does shipping take?", vi: "Thời gian giao hàng bao lâu?" },
  "faq.a2": { en: "Standard shipping takes 5–10 business days. Express shipping takes 2–4 business days.", vi: "Giao hàng tiêu chuẩn 5–10 ngày làm việc. Giao hàng nhanh 2–4 ngày làm việc." },
  "faq.q3": { en: "Do you ship internationally?", vi: "Có giao hàng quốc tế không?" },
  "faq.a3": { en: "Yes! We ship to Singapore, Malaysia, Thailand, Indonesia, Philippines, Vietnam, US, UK, and Australia.", vi: "Có! Chúng tôi giao đến Singapore, Malaysia, Thái Lan, Indonesia, Philippines, Việt Nam, Mỹ, Anh và Úc." },
  "faq.q4": { en: "How do I find my size?", vi: "Làm sao chọn đúng size?" },
  "faq.a4": { en: "Check our Size Guide page for detailed measurements. If you're between sizes, we recommend sizing up.", vi: "Xem trang Hướng Dẫn Size để biết số đo chi tiết. Nếu ở giữa hai size, chọn size lớn hơn." },
  "faq.q5": { en: "Can I change or cancel my order?", vi: "Có thể thay đổi hoặc hủy đơn hàng không?" },
  "faq.a5": { en: "Please contact us within 2 hours of placing your order at support@resona.com. Once shipped, orders cannot be cancelled.", vi: "Vui lòng liên hệ trong vòng 2 giờ sau khi đặt hàng tại support@resona.com. Đơn đã gửi không thể hủy." },
  "faq.q6": { en: "What payment methods do you accept?", vi: "Chấp nhận phương thức thanh toán nào?" },
  "faq.a6": { en: "We accept all major credit cards (Visa, Mastercard, Amex) through our secure Stripe checkout.", vi: "Chúng tôi chấp nhận thẻ tín dụng (Visa, Mastercard, Amex) qua thanh toán Stripe bảo mật." },
  "faq.q7": { en: "Are your clothes sustainable?", vi: "Quần áo có bền vững không?" },
  "faq.a7": { en: "We're committed to sustainable fashion. We use eco-friendly fabrics and work with ethical manufacturers in Southeast Asia.", vi: "Chúng tôi cam kết thời trang bền vững. Sử dụng vải thân thiện môi trường và hợp tác với nhà sản xuất có đạo đức tại Đông Nam Á." },
  "faq.q8": { en: "How do I track my order?", vi: "Theo dõi đơn hàng như thế nào?" },
  "faq.a8": { en: "Once your order ships, you'll receive a tracking number via email. You can also check your order status in your account.", vi: "Khi đơn hàng được gửi, bạn sẽ nhận số theo dõi qua email. Bạn cũng có thể kiểm tra trạng thái trong tài khoản." },

  // Contact
  "contact.title": { en: "Contact Us", vi: "Liên Hệ" },
  "contact.intro": { en: "We'd love to hear from you. Reach out and we'll get back to you within 24 hours.", vi: "Chúng tôi rất muốn nghe từ bạn. Liên hệ và chúng tôi sẽ phản hồi trong 24 giờ." },
  "contact.email": { en: "Email", vi: "Email" },
  "contact.social": { en: "Social", vi: "Mạng Xã Hội" },
  "contact.hours": { en: "Business Hours", vi: "Giờ Làm Việc" },
  "contact.hoursValue": { en: "Mon–Fri, 9am–6pm SGT", vi: "Thứ 2–6, 9h–18h (SGT)" },
  "contact.location": { en: "Location", vi: "Địa Điểm" },

  // Privacy
  "privacy.title": { en: "Privacy Policy", vi: "Chính Sách Bảo Mật" },
  "privacy.updated": { en: "Last updated: April 2026", vi: "Cập nhật lần cuối: Tháng 4, 2026" },
  "privacy.collectTitle": { en: "Information We Collect", vi: "Thông Tin Chúng Tôi Thu Thập" },
  "privacy.collectText": { en: "We collect information you provide when creating an account, placing an order, or contacting us. This includes your name, email, shipping address, and payment information (processed securely by Stripe).", vi: "Chúng tôi thu thập thông tin bạn cung cấp khi tạo tài khoản, đặt hàng hoặc liên hệ. Bao gồm tên, email, địa chỉ giao hàng và thông tin thanh toán (xử lý bảo mật qua Stripe)." },
  "privacy.useTitle": { en: "How We Use Your Information", vi: "Cách Sử Dụng Thông Tin" },
  "privacy.useText": { en: "We use your information to process orders, communicate about your purchases, improve our services, and send marketing communications (with your consent).", vi: "Chúng tôi sử dụng thông tin để xử lý đơn hàng, liên lạc về mua hàng, cải thiện dịch vụ và gửi thông tin marketing (với sự đồng ý của bạn)." },
  "privacy.securityTitle": { en: "Data Security", vi: "Bảo Mật Dữ Liệu" },
  "privacy.securityText": { en: "We use industry-standard encryption and security measures. Payment information is processed by Stripe and never stored on our servers.", vi: "Chúng tôi sử dụng mã hóa và biện pháp bảo mật tiêu chuẩn. Thông tin thanh toán được Stripe xử lý và không lưu trên máy chủ của chúng tôi." },
  "privacy.rightsTitle": { en: "Your Rights", vi: "Quyền Của Bạn" },
  "privacy.rightsText": { en: "You can access, update, or delete your personal data at any time through your account settings or by contacting us at support@resona.com.", vi: "Bạn có thể truy cập, cập nhật hoặc xóa dữ liệu cá nhân bất cứ lúc nào qua cài đặt tài khoản hoặc liên hệ support@resona.com." },
  "privacy.contactTitle": { en: "Contact", vi: "Liên Hệ" },
  "privacy.contactText": { en: "For privacy-related questions, email us at support@resona.com.", vi: "Câu hỏi về bảo mật, email support@resona.com." },

  // Terms
  "terms.title": { en: "Terms of Service", vi: "Điều Khoản Dịch Vụ" },
  "terms.updated": { en: "Last updated: April 2026", vi: "Cập nhật lần cuối: Tháng 4, 2026" },
  "terms.generalTitle": { en: "General", vi: "Tổng Quan" },
  "terms.generalText": { en: "By using resona.com, you agree to these terms. We reserve the right to update these terms at any time.", vi: "Khi sử dụng resona.com, bạn đồng ý với các điều khoản này. Chúng tôi có quyền cập nhật bất cứ lúc nào." },
  "terms.ordersTitle": { en: "Orders & Payments", vi: "Đơn Hàng & Thanh Toán" },
  "terms.ordersText": { en: "All prices are in USD. We accept major credit cards via Stripe. Orders are confirmed once payment is processed. We reserve the right to cancel orders due to pricing errors or stock issues.", vi: "Giá bằng USD. Chấp nhận thẻ tín dụng qua Stripe. Đơn hàng được xác nhận khi thanh toán thành công. Chúng tôi có quyền hủy đơn do lỗi giá hoặc hết hàng." },
  "terms.shippingTitle": { en: "Shipping & Returns", vi: "Vận Chuyển & Đổi Trả" },
  "terms.shippingText": { en: "See our Shipping & Returns page for detailed policies. Items must be returned within 30 days, unworn with tags attached.", vi: "Xem trang Vận Chuyển & Đổi Trả để biết chi tiết. Sản phẩm phải đổi trả trong 30 ngày, chưa mặc còn nguyên tag." },
  "terms.ipTitle": { en: "Intellectual Property", vi: "Sở Hữu Trí Tuệ" },
  "terms.ipText": { en: "All content on this site — including images, text, and designs — is owned by Resona and may not be reproduced without permission.", vi: "Tất cả nội dung trên trang — bao gồm hình ảnh, văn bản và thiết kế — thuộc sở hữu của Resona và không được sao chép khi chưa có sự cho phép." },
  "terms.contactTitle": { en: "Contact", vi: "Liên Hệ" },
  "terms.contactText": { en: "Questions about these terms? Email support@resona.com.", vi: "Câu hỏi về điều khoản? Email support@resona.com." },

  // Story
  "story.title": { en: "Our Story", vi: "Câu Chuyện Của Chúng Tôi" },
  "story.p1": { en: "Resona started with a simple observation: the most confident women we knew never seemed to try. Their style was effortless — like golden hour light that just happens to make everything look beautiful.", vi: "Resona bắt đầu từ một quan sát đơn giản: những phụ nữ tự tin nhất mà chúng tôi biết dường như không bao giờ cố gắng. Phong cách của họ tự nhiên — như ánh sáng giờ vàng khiến mọi thứ trở nên đẹp đẽ." },
  "story.p2": { en: "We wanted to create clothes that capture that feeling. Not loud, not trying too hard — just warm, natural, and unmistakably self-assured.", vi: "Chúng tôi muốn tạo ra quần áo nắm bắt cảm giác đó. Không ồn ào, không cố gắng quá — chỉ ấm áp, tự nhiên, và tự tin không thể nhầm lẫn." },
  "story.p3": { en: "Born in Southeast Asia, Resona draws inspiration from the region's tropical warmth, vibrant street style, and the easy confidence of women who know exactly who they are. Every piece is designed to move with you, not define you.", vi: "Sinh ra tại Đông Nam Á, Resona lấy cảm hứng từ sự ấm áp nhiệt đới, phong cách đường phố sôi động, và sự tự tin tự nhiên của những phụ nữ biết rõ mình là ai. Mỗi sản phẩm được thiết kế để di chuyển cùng bạn, không phải định nghĩa bạn." },
  "story.p4": { en: "The name \"Resona\" comes from resonance — that quality of echoing outward, of leaving an impression without raising your voice. That's what we want our clothes to do: resonate.", vi: "Tên \"Resona\" bắt nguồn từ cộng hưởng — phẩm chất vang vọng ra ngoài, để lại ấn tượng mà không cần lên tiếng. Đó là điều chúng tôi muốn quần áo làm được: cộng hưởng." },
  "story.quote": { en: "\"Ease That Resonates\" — that's not just our tagline. It's our design philosophy.", vi: "\"Sự Thoải Mái Cộng Hưởng\" — đó không chỉ là slogan. Đó là triết lý thiết kế của chúng tôi." },

  // Sustainability
  "sustainability.title": { en: "Sustainability", vi: "Bền Vững" },
  "sustainability.intro": { en: "At Resona, sustainability isn't a marketing buzzword — it's how we do business. We believe fashion should feel good in every sense.", vi: "Tại Resona, bền vững không phải từ khóa marketing — đó là cách chúng tôi kinh doanh. Chúng tôi tin thời trang nên mang lại cảm giác tốt theo mọi nghĩa." },
  "sustainability.commitTitle": { en: "Our Commitments", vi: "Cam Kết Của Chúng Tôi" },
  "sustainability.c1": { en: "Eco-friendly fabrics: organic cotton, Tencel, recycled polyester", vi: "Vải thân thiện môi trường: cotton hữu cơ, Tencel, polyester tái chế" },
  "sustainability.c2": { en: "Ethical manufacturing with fair wages in Southeast Asia", vi: "Sản xuất có đạo đức với mức lương công bằng tại Đông Nam Á" },
  "sustainability.c3": { en: "Minimal packaging using recycled and biodegradable materials", vi: "Bao bì tối giản sử dụng vật liệu tái chế và phân hủy sinh học" },
  "sustainability.c4": { en: "Small-batch production to reduce waste", vi: "Sản xuất số lượng nhỏ để giảm lãng phí" },
  "sustainability.c5": { en: "Carbon-neutral shipping on all orders", vi: "Vận chuyển trung hòa carbon cho tất cả đơn hàng" },
  "sustainability.goalTitle": { en: "Our Goal", vi: "Mục Tiêu" },
  "sustainability.goalText": { en: "By 2027, we aim to use 100% sustainable materials across all product lines. We're not perfect yet, but we're committed to getting better every season.", vi: "Đến 2027, chúng tôi hướng đến sử dụng 100% vật liệu bền vững cho tất cả dòng sản phẩm. Chưa hoàn hảo, nhưng cam kết cải thiện mỗi mùa." },

  // Careers
  "careers.title": { en: "Careers", vi: "Tuyển Dụng" },
  "careers.intro": { en: "We're a small but growing team based in Southeast Asia, building a fashion brand that resonates. If you're passionate about fashion, sustainability, and creating beautiful things — we'd love to hear from you.", vi: "Chúng tôi là đội ngũ nhỏ nhưng đang phát triển tại Đông Nam Á, xây dựng thương hiệu thời trang cộng hưởng. Nếu bạn đam mê thời trang, bền vững và tạo ra những điều đẹp đẽ — chúng tôi muốn nghe từ bạn." },
  "careers.openPositions": { en: "Open Positions", vi: "Vị Trí Tuyển Dụng" },
  "careers.noPositions": { en: "No open positions at the moment, but we're always looking for talented people.", vi: "Hiện chưa có vị trí tuyển dụng, nhưng chúng tôi luôn tìm kiếm người tài năng." },
  "careers.cta": { en: "Send your portfolio or resume to careers@resona.com and tell us why you'd be a great fit.", vi: "Gửi portfolio hoặc CV đến careers@resona.com và cho chúng tôi biết tại sao bạn phù hợp." },
} as const;

type DictKey = keyof typeof dict;

export function useShopT() {
  const locale = useShopLocale((s) => s.locale);
  return (key: DictKey) => dict[key][locale];
}

export function useProductT() {
  const locale = useShopLocale((s) => s.locale);

  return {
    name: (slug: string, fallback: string) => {
      const key = `product.${slug}.name` as DictKey;
      if (key in dict) {
        const val = dict[key][locale];
        return val || fallback;
      }
      return fallback;
    },
    desc: (slug: string, fallback: string | null) => {
      if (!fallback && locale === "en") return fallback;
      const key = `product.${slug}.desc` as DictKey;
      if (key in dict) {
        const val = dict[key][locale];
        return val || fallback;
      }
      return fallback;
    },
  };
}

export function useCollectionT() {
  const locale = useShopLocale((s) => s.locale);
  return {
    name: (slug: string, fallback: string) => {
      const key = `collection.${slug}.name` as DictKey;
      if (key in dict) return dict[key][locale] || fallback;
      return fallback;
    },
    desc: (slug: string, fallback: string | null) => {
      const key = `collection.${slug}.desc` as DictKey;
      if (key in dict) return dict[key][locale] || fallback;
      return fallback;
    },
  };
}

export function useCategoryT() {
  const locale = useShopLocale((s) => s.locale);
  return (slug: string, fallback: string) => {
    const key = `category.${slug}.name` as DictKey;
    if (key in dict) return dict[key][locale] || fallback;
    return fallback;
  };
}
