"use client";

// Storefront copy. The shop is English only; text listed in site-content.ts
// can be overridden from Admin → Settings.
const dict = {
  // Nav
  "nav.newArrivals": { en: "New Arrivals" },
  "nav.shopAll": { en: "Shop All" },
  "nav.collections": { en: "Collections" },
  "nav.about": { en: "About" },

  // Header / Search
  "search.placeholder": { en: "Search products..." },
  "search.title": { en: "Search products" },

  // Announcement
  "announce.freeShipping": { en: "Free shipping on orders over $80 — Southeast Asia & worldwide" },

  // Hero
  "hero.tagline": { en: "Where Confidence Echoes" },
  "hero.title1": { en: "Ease That" },
  "hero.title2": { en: "Resonates" },
  "hero.subtitle": { en: "Casual fashion for the confident woman. Born under Southeast Asian golden skies, designed for effortless radiance everywhere you go." },
  "hero.shopNow": { en: "Shop Now" },
  "hero.newArrivals": { en: "New Arrivals" },

  // Featured
  "featured.tagline": { en: "Curated For You" },
  "featured.title": { en: "Featured Picks" },
  "featured.viewAll": { en: "View All" },
  "featured.viewAllProducts": { en: "View All Products" },

  // Collections
  "collections.tagline": { en: "Explore" },
  "collections.title": { en: "Collections" },
  "collections.shopNow": { en: "Shop Now" },
  "collections.explore": { en: "Explore" },
  "collections.subtitle": { en: "Curated edits for every mood and moment." },
  "collections.comingSoon": { en: "Collections coming soon." },

  // Brand Story
  "brand.tagline": { en: "Our Philosophy" },
  "brand.title1": { en: "Fashion should feel like" },
  "brand.goldenHour": { en: "golden hour" },
  "brand.title2": { en: "— warm, effortless, and undeniably" },
  "brand.you": { en: "you" },
  "brand.story": { en: "Resona was born in Southeast Asia, where the sun paints everything in warm amber and confidence comes naturally. We design for women who don't try to stand out — they just do. Every piece carries that effortless resonance: the ease of a tropical breeze, the glow of golden light on skin." },
  "brand.sustainable": { en: "Sustainable Fabrics" },
  "brand.born": { en: "Born & Designed" },
  "brand.sizing": { en: "Inclusive Sizing" },

  // Newsletter
  "newsletter.title": { en: "Stay in the Glow" },
  "newsletter.subtitle": { en: "Be the first to know about new arrivals, exclusive offers, and Resona stories. No spam — just warmth." },
  "newsletter.placeholder": { en: "Your email address" },
  "newsletter.subscribe": { en: "Subscribe" },
  "newsletter.success": { en: "Welcome to the Resona family!" },

  // Products
  "products.title": { en: "Shop All" },
  "products.subtitle": { en: "Discover pieces that resonate with your style." },
  "products.all": { en: "All" },
  "products.newest": { en: "Newest" },
  "products.priceLow": { en: "Price: Low to High" },
  "products.priceHigh": { en: "Price: High to Low" },
  "products.noProducts": { en: "No products found." },
  "products.results": { en: "Results for" },
  "products.quickAdd": { en: "Quick Add" },
  "products.added": { en: "Added!" },
  "products.sale": { en: "Sale" },

  // Product Detail
  "product.color": { en: "Color" },
  "product.size": { en: "Size" },
  "product.addToCart": { en: "Add to Cart" },
  "product.added": { en: "Added!" },
  "product.outOfStock": { en: "Out of Stock" },
  "product.onlyLeft": { en: "Only {n} left in stock" },
  "product.off": { en: "off" },

  // Reviews
  "reviews.title": { en: "Reviews" },
  "reviews.write": { en: "Write a Review" },
  "reviews.rating": { en: "Rating" },
  "reviews.reviewTitle": { en: "Title" },
  "reviews.reviewTitlePlaceholder": { en: "Summary of your review" },
  "reviews.reviewBody": { en: "Review" },
  "reviews.reviewBodyPlaceholder": { en: "Share your experience..." },
  "reviews.submit": { en: "Submit Review" },
  "reviews.submitting": { en: "Submitting..." },
  "reviews.empty": { en: "No reviews yet. Be the first to share your experience." },

  // Cart
  "cart.title": { en: "Your Cart" },
  "cart.empty": { en: "Your cart is empty" },
  "cart.emptySubtitle": { en: "Discover pieces that resonate with your style." },
  "cart.startShopping": { en: "Start Shopping" },
  "cart.orderSummary": { en: "Order Summary" },
  "cart.subtotal": { en: "Subtotal" },
  "cart.shipping": { en: "Shipping" },
  "cart.free": { en: "Free" },
  "cart.freeShippingNote": { en: "Free shipping on orders over $80" },
  "cart.total": { en: "Total" },
  "cart.checkout": { en: "Proceed to Checkout" },
  "cart.continueShopping": { en: "Continue Shopping" },
  "cart.items": { en: "items" },

  // Checkout
  "checkout.title": { en: "Checkout" },
  "checkout.review": { en: "Order Review" },
  "checkout.subtotal": { en: "Subtotal" },
  "checkout.shippingNote": { en: "Shipping and taxes calculated at checkout." },
  "checkout.pay": { en: "Pay with Stripe" },
  "checkout.redirecting": { en: "Redirecting to payment..." },

  // Checkout Success
  "success.title": { en: "Thank You!" },
  "success.order": { en: "Order" },
  "success.message": { en: "Your order has been confirmed. We'll send you an email with your order details and tracking information once your items ship." },
  "success.confirming": { en: "Confirming your order..." },
  "success.viewOrders": { en: "View Orders" },
  "success.continueShopping": { en: "Continue Shopping" },

  // Auth
  "auth.signIn": { en: "Sign In" },
  "auth.signUp": { en: "Create Account" },
  "auth.signInSubtitle": { en: "Welcome back. Sign in to continue." },
  "auth.signUpSubtitle": { en: "Create your account to get started." },
  "auth.fullName": { en: "Full Name" },
  "auth.email": { en: "Email" },
  "auth.password": { en: "Password" },
  "auth.forgotPassword": { en: "Forgot password?" },
  "auth.forgotSubtitle": { en: "Enter your email and we'll send you a reset link." },
  "auth.sendResetLink": { en: "Send Reset Link" },
  "auth.resetSent": { en: "Check your email for a password reset link." },
  "auth.backToLogin": { en: "Back to Sign In" },
  "auth.resetPassword": { en: "Reset Password" },
  "auth.resetSubtitle": { en: "Enter your new password." },
  "auth.newPassword": { en: "New Password" },
  "auth.confirmPassword": { en: "Confirm Password" },
  "auth.updatePassword": { en: "Update Password" },
  "auth.passwordMismatch": { en: "Passwords do not match." },
  "auth.noAccount": { en: "Don't have an account?" },
  "auth.hasAccount": { en: "Already have an account?" },

  // User menu
  "user.account": { en: "Account" },
  "user.orders": { en: "Orders" },
  "user.addresses": { en: "Addresses" },
  "user.settings": { en: "Settings" },
  "user.signOut": { en: "Sign Out" },

  // Account pages
  "account.title": { en: "My Account" },
  "account.welcome": { en: "Welcome back," },
  "account.orders": { en: "Orders" },
  "account.addresses": { en: "Addresses" },
  "account.wishlist": { en: "Wishlist" },
  "account.recentOrders": { en: "Recent Orders" },
  "account.viewAll": { en: "View all" },
  "account.noOrders": { en: "No orders yet." },
  "account.startShopping": { en: "Start shopping" },
  "account.overview": { en: "Overview" },
  "account.settings": { en: "Settings" },
  "account.orderHistory": { en: "Order History" },
  "account.noOrdersYet": { en: "You haven't placed any orders yet." },
  "account.savedAddresses": { en: "Saved Addresses" },
  "account.addAddress": { en: "Add New Address" },
  "account.default": { en: "Default" },
  "account.accountSettings": { en: "Account Settings" },
  "account.requestRefund": { en: "Request Refund" },
  "account.refundConfirm": { en: "Are you sure you want to request a refund for this order?" },
  "account.refundSuccess": { en: "Refund requested successfully" },
  "account.refundError": { en: "Failed to request refund" },
  "account.refunding": { en: "Processing..." },
  "account.refundPending": { en: "Your refund request is being reviewed. We'll process it shortly." },
  "account.orderDetail": { en: "Order Detail" },
  "account.backToOrders": { en: "Back to Orders" },
  "account.shippingAddress": { en: "Shipping Address" },
  "account.orderItems": { en: "Items" },
  "account.subtotal": { en: "Subtotal" },
  "account.shipping": { en: "Shipping" },
  "account.tax": { en: "Tax" },
  "account.viewOrder": { en: "View Details" },

  // Order statuses
  "status.pending": { en: "Pending" },
  "status.confirmed": { en: "Confirmed" },
  "status.processing": { en: "Processing" },
  "status.shipped": { en: "Shipped" },
  "status.delivered": { en: "Delivered" },
  "status.cancelled": { en: "Cancelled" },
  "status.refund_requested": { en: "Refund Requested" },
  "status.refunded": { en: "Refunded" },

  // Footer
  "footer.shop": { en: "Shop" },
  "footer.help": { en: "Help" },
  "footer.company": { en: "Company" },
  "footer.brand": { en: "Ease That Resonates. Casual fashion for the confident woman, born under Southeast Asian golden skies." },
  "footer.newArrivals": { en: "New Arrivals" },
  "footer.bestSellers": { en: "Best Sellers" },
  "footer.shopAll": { en: "Shop All" },
  "footer.collections": { en: "Collections" },
  "footer.shipping": { en: "Shipping & Returns" },
  "footer.sizeGuide": { en: "Size Guide" },
  "footer.faq": { en: "FAQ" },
  "footer.contact": { en: "Contact Us" },
  "footer.about": { en: "About Resona" },
  "footer.story": { en: "Our Story" },
  "footer.sustainability": { en: "Sustainability" },
  "footer.careers": { en: "Careers" },
  "footer.rights": { en: "All rights reserved." },
  "footer.privacy": { en: "Privacy Policy" },
  "footer.terms": { en: "Terms of Service" },

  // Product names (by slug)
  "product.sunset-wrap-dress.name": { en: "Sunset Wrap Dress" },
  "product.sunset-wrap-dress.desc": { en: "" },
  "product.golden-hour-crop-top.name": { en: "Golden Hour Crop Top" },
  "product.golden-hour-crop-top.desc": { en: "" },
  "product.coral-breeze-midi-skirt.name": { en: "Coral Breeze Midi Skirt" },
  "product.coral-breeze-midi-skirt.desc": { en: "" },
  "product.tropical-linen-set.name": { en: "Tropical Linen Co-ord Set" },
  "product.tropical-linen-set.desc": { en: "" },
  "product.guava-slip-dress.name": { en: "Guava Slip Dress" },
  "product.guava-slip-dress.desc": { en: "" },
  "product.sand-dune-wide-pants.name": { en: "Sand Dune Wide Pants" },
  "product.sand-dune-wide-pants.desc": { en: "" },
  "product.amber-glow-halter-top.name": { en: "Amber Glow Halter Top" },
  "product.amber-glow-halter-top.desc": { en: "" },
  "product.emerald-breeze-shorts.name": { en: "Emerald Breeze Shorts" },
  "product.emerald-breeze-shorts.desc": { en: "" },

  // Collection names (by slug)
  "collection.new-arrivals.name": { en: "New Arrivals" },
  "collection.new-arrivals.desc": { en: "Just dropped — fresh styles for the season" },
  "collection.best-sellers.name": { en: "Best Sellers" },
  "collection.best-sellers.desc": { en: "Our most-loved pieces" },
  "collection.summer-glow.name": { en: "Summer Glow" },
  "collection.summer-glow.desc": { en: "Sun-kissed essentials for warm days" },
  "collection.resort-edit.name": { en: "Resort Edit" },
  "collection.resort-edit.desc": { en: "Vacation-ready pieces" },

  // Category names (by slug)
  "category.dresses.name": { en: "Dresses" },
  "category.tops.name": { en: "Tops" },
  "category.bottoms.name": { en: "Bottoms" },
  "category.sets.name": { en: "Sets" },

  // About page
  "about.title": { en: "About Resona" },
  "about.p1": { en: "Resona was born under the golden skies of Southeast Asia — where warmth isn't just a temperature, it's a feeling. We create casual fashion for women who radiate confidence without trying." },
  "about.p2": { en: "Our name comes from \"resonance\" — that effortless echo of self-assurance that follows you into every room. We believe style should feel like golden hour: warm, natural, and undeniably you." },
  "about.mission": { en: "Our Mission" },
  "about.missionText": { en: "To design clothes that make every woman feel like she's walking through her own golden hour — confident, relaxed, and glowing from within." },
  "about.madeIn": { en: "Made in Southeast Asia" },
  "about.madeInText": { en: "Every piece is designed and crafted in Southeast Asia, working with local artisans and sustainable manufacturers. We're proud of our roots and committed to ethical production." },

  // Shipping page
  "shipping.title": { en: "Shipping & Returns" },
  "shipping.shippingTitle": { en: "Shipping" },
  "shipping.s1": { en: "Free standard shipping on orders over $80" },
  "shipping.s2": { en: "Standard shipping (5–10 business days): $9.99" },
  "shipping.s3": { en: "Express shipping (2–4 business days): $19.99" },
  "shipping.s4": { en: "We ship to Singapore, Malaysia, Thailand, Indonesia, Philippines, Vietnam, US, UK, and Australia" },
  "shipping.returnsTitle": { en: "Returns" },
  "shipping.r1": { en: "30-day return policy for unworn items with tags attached" },
  "shipping.r2": { en: "Free returns for orders within Southeast Asia" },
  "shipping.r3": { en: "International returns: customer covers return shipping" },
  "shipping.r4": { en: "Refunds processed within 5–7 business days after we receive the item" },
  "shipping.exchangeTitle": { en: "Exchanges" },
  "shipping.exchangeText": { en: "Need a different size? Contact us at support@resona.com and we'll arrange an exchange at no extra cost." },

  // Size Guide
  "sizeGuide.title": { en: "Size Guide" },
  "sizeGuide.intro": { en: "All measurements are in centimeters. If you're between sizes, we recommend sizing up for a relaxed fit." },
  "sizeGuide.size": { en: "Size" },
  "sizeGuide.bust": { en: "Bust (cm)" },
  "sizeGuide.waist": { en: "Waist (cm)" },
  "sizeGuide.hips": { en: "Hips (cm)" },
  "sizeGuide.help": { en: "Need help? Contact us at support@resona.com" },

  // FAQ
  "faq.title": { en: "Frequently Asked Questions" },
  "faq.q1": { en: "What is Resona's return policy?" },
  "faq.a1": { en: "We offer a 30-day return policy for unworn items with tags attached. Free returns within Southeast Asia." },
  "faq.q2": { en: "How long does shipping take?" },
  "faq.a2": { en: "Standard shipping takes 5–10 business days. Express shipping takes 2–4 business days." },
  "faq.q3": { en: "Do you ship internationally?" },
  "faq.a3": { en: "Yes! We ship to Singapore, Malaysia, Thailand, Indonesia, Philippines, Vietnam, US, UK, and Australia." },
  "faq.q4": { en: "How do I find my size?" },
  "faq.a4": { en: "Check our Size Guide page for detailed measurements. If you're between sizes, we recommend sizing up." },
  "faq.q5": { en: "Can I change or cancel my order?" },
  "faq.a5": { en: "Please contact us within 2 hours of placing your order at support@resona.com. Once shipped, orders cannot be cancelled." },
  "faq.q6": { en: "What payment methods do you accept?" },
  "faq.a6": { en: "We accept all major credit cards (Visa, Mastercard, Amex) through our secure Stripe checkout." },
  "faq.q7": { en: "Are your clothes sustainable?" },
  "faq.a7": { en: "We're committed to sustainable fashion. We use eco-friendly fabrics and work with ethical manufacturers in Southeast Asia." },
  "faq.q8": { en: "How do I track my order?" },
  "faq.a8": { en: "Once your order ships, you'll receive a tracking number via email. You can also check your order status in your account." },

  // Contact
  "contact.title": { en: "Contact Us" },
  "contact.intro": { en: "We'd love to hear from you. Reach out and we'll get back to you within 24 hours." },
  "contact.email": { en: "Email" },
  "contact.social": { en: "Social" },
  "contact.hours": { en: "Business Hours" },
  "contact.hoursValue": { en: "Mon–Fri, 9am–6pm SGT" },
  "contact.location": { en: "Location" },

  // Privacy
  "privacy.title": { en: "Privacy Policy" },
  "privacy.updated": { en: "Last updated: April 2026" },
  "privacy.collectTitle": { en: "Information We Collect" },
  "privacy.collectText": { en: "We collect information you provide when creating an account, placing an order, or contacting us. This includes your name, email, shipping address, and payment information (processed securely by Stripe)." },
  "privacy.useTitle": { en: "How We Use Your Information" },
  "privacy.useText": { en: "We use your information to process orders, communicate about your purchases, improve our services, and send marketing communications (with your consent)." },
  "privacy.securityTitle": { en: "Data Security" },
  "privacy.securityText": { en: "We use industry-standard encryption and security measures. Payment information is processed by Stripe and never stored on our servers." },
  "privacy.rightsTitle": { en: "Your Rights" },
  "privacy.rightsText": { en: "You can access, update, or delete your personal data at any time through your account settings or by contacting us at support@resona.com." },
  "privacy.contactTitle": { en: "Contact" },
  "privacy.contactText": { en: "For privacy-related questions, email us at support@resona.com." },

  // Terms
  "terms.title": { en: "Terms of Service" },
  "terms.updated": { en: "Last updated: April 2026" },
  "terms.generalTitle": { en: "General" },
  "terms.generalText": { en: "By using resona.com, you agree to these terms. We reserve the right to update these terms at any time." },
  "terms.ordersTitle": { en: "Orders & Payments" },
  "terms.ordersText": { en: "All prices are in USD. We accept major credit cards via Stripe. Orders are confirmed once payment is processed. We reserve the right to cancel orders due to pricing errors or stock issues." },
  "terms.shippingTitle": { en: "Shipping & Returns" },
  "terms.shippingText": { en: "See our Shipping & Returns page for detailed policies. Items must be returned within 30 days, unworn with tags attached." },
  "terms.ipTitle": { en: "Intellectual Property" },
  "terms.ipText": { en: "All content on this site — including images, text, and designs — is owned by Resona and may not be reproduced without permission." },
  "terms.contactTitle": { en: "Contact" },
  "terms.contactText": { en: "Questions about these terms? Email support@resona.com." },

  // Story
  "story.title": { en: "Our Story" },
  "story.p1": { en: "Resona started with a simple observation: the most confident women we knew never seemed to try. Their style was effortless — like golden hour light that just happens to make everything look beautiful." },
  "story.p2": { en: "We wanted to create clothes that capture that feeling. Not loud, not trying too hard — just warm, natural, and unmistakably self-assured." },
  "story.p3": { en: "Born in Southeast Asia, Resona draws inspiration from the region's tropical warmth, vibrant street style, and the easy confidence of women who know exactly who they are. Every piece is designed to move with you, not define you." },
  "story.p4": { en: "The name \"Resona\" comes from resonance — that quality of echoing outward, of leaving an impression without raising your voice. That's what we want our clothes to do: resonate." },
  "story.quote": { en: "\"Ease That Resonates\" — that's not just our tagline. It's our design philosophy." },

  // Sustainability
  "sustainability.title": { en: "Sustainability" },
  "sustainability.intro": { en: "At Resona, sustainability isn't a marketing buzzword — it's how we do business. We believe fashion should feel good in every sense." },
  "sustainability.commitTitle": { en: "Our Commitments" },
  "sustainability.c1": { en: "Eco-friendly fabrics: organic cotton, Tencel, recycled polyester" },
  "sustainability.c2": { en: "Ethical manufacturing with fair wages in Southeast Asia" },
  "sustainability.c3": { en: "Minimal packaging using recycled and biodegradable materials" },
  "sustainability.c4": { en: "Small-batch production to reduce waste" },
  "sustainability.c5": { en: "Carbon-neutral shipping on all orders" },
  "sustainability.goalTitle": { en: "Our Goal" },
  "sustainability.goalText": { en: "By 2027, we aim to use 100% sustainable materials across all product lines. We're not perfect yet, but we're committed to getting better every season." },

  // Careers
  "careers.title": { en: "Careers" },
  "careers.intro": { en: "We're a small but growing team based in Southeast Asia, building a fashion brand that resonates. If you're passionate about fashion, sustainability, and creating beautiful things — we'd love to hear from you." },
  "careers.openPositions": { en: "Open Positions" },
  "careers.noPositions": { en: "No open positions at the moment, but we're always looking for talented people." },
  "careers.cta": { en: "Send your portfolio or resume to careers@resona.com and tell us why you'd be a great fit." },

  // Added: navigation, account, reviews, stock
  "user.admin": { en: "Admin Dashboard" },
  "status.partially_refunded": { en: "Partially Refunded" },
  "account.tracking": { en: "Shipping & Tracking" },
  "account.carrier": { en: "Carrier" },
  "account.trackingNumber": { en: "Tracking Number" },
  "account.shippedOn": { en: "Shipped on" },
  "account.deliveredOn": { en: "Delivered on" },
  "account.wishlistEmpty": { en: "Your wishlist is empty." },
  "products.soldOut": { en: "Sold Out" },
  "products.prev": { en: "Previous" },
  "products.next": { en: "Next" },
  "products.page": { en: "Page" },
  "checkout.unavailable": { en: "Some items are out of stock or no longer available. Please review your cart." },
  "checkout.error": { en: "Could not start checkout. Please try again." },
  "reviews.anonymous": { en: "Anonymous" },
  "reviews.verified": { en: "Verified purchase" },
  "reviews.signInRequired": { en: "Please sign in to write a review." },
  "reviews.alreadyReviewed": { en: "You have already reviewed this product." },
  "reviews.error": { en: "Could not submit your review." },
} as const;

export type ShopTextKey = keyof typeof dict;

/** Built-in text for a key, shown in the admin as the default. */
export function shopDefaultText(key: string) {
  return (dict as Record<string, { en: string }>)[key]?.en || "";
}

export function useShopT(overrides?: Record<string, string>) {
  return (key: ShopTextKey) => overrides?.[key] || dict[key].en;
}
