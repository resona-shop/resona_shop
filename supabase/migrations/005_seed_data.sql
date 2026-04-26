-- ============================================
-- Resona Seed Data
-- Run this in Supabase SQL Editor AFTER 001_initial_schema.sql
-- ============================================

-- Categories
insert into public.categories (id, name, slug, description, sort_order) values
  ('a1000000-0000-0000-0000-000000000001', 'Dresses', 'dresses', 'Effortless dresses for every occasion', 1),
  ('a1000000-0000-0000-0000-000000000002', 'Tops', 'tops', 'Casual tops and blouses', 2),
  ('a1000000-0000-0000-0000-000000000003', 'Bottoms', 'bottoms', 'Skirts, pants and shorts', 3),
  ('a1000000-0000-0000-0000-000000000004', 'Sets', 'sets', 'Coordinated sets and co-ords', 4)
on conflict (slug) do nothing;

-- Collections
insert into public.collections (id, name, slug, description, is_active, sort_order) values
  ('b0100000-0000-0000-0000-000000000001', 'New Arrivals', 'new-arrivals', 'Just dropped — fresh styles for the season', true, 1),
  ('b0100000-0000-0000-0000-000000000002', 'Best Sellers', 'best-sellers', 'Our most-loved pieces', true, 2),
  ('b0100000-0000-0000-0000-000000000003', 'Summer Glow', 'summer-glow', 'Sun-kissed essentials for warm days', true, 3),
  ('b0100000-0000-0000-0000-000000000004', 'Resort Edit', 'resort-edit', 'Vacation-ready pieces', true, 4)
on conflict (slug) do nothing;

-- Products
insert into public.products (id, name, slug, description, category_id, base_price, compare_at_price, is_active, is_featured) values
  ('d1000000-0000-0000-0000-000000000001',
   'Sunset Wrap Dress',
   'sunset-wrap-dress',
   'A flowing wrap dress in warm coral tones. The perfect golden hour companion — lightweight fabric drapes beautifully and moves with every breeze. Adjustable tie waist for a flattering fit.',
   'a1000000-0000-0000-0000-000000000001',
   89.00, null, true, true),

  ('d1000000-0000-0000-0000-000000000002',
   'Golden Hour Crop Top',
   'golden-hour-crop-top',
   'Relaxed-fit crop top in soft mango. Slightly cropped with a boxy silhouette — pairs perfectly with high-waisted bottoms. Breathable cotton blend keeps you cool under the sun.',
   'a1000000-0000-0000-0000-000000000002',
   49.00, null, true, true),

  ('d1000000-0000-0000-0000-000000000003',
   'Coral Breeze Midi Skirt',
   'coral-breeze-midi-skirt',
   'A-line midi skirt with a subtle slit. Elastic waistband for effortless comfort. The warm coral hue catches light beautifully — like a tropical sunset on fabric.',
   'a1000000-0000-0000-0000-000000000003',
   65.00, 85.00, true, true),

  ('d1000000-0000-0000-0000-000000000004',
   'Tropical Linen Co-ord Set',
   'tropical-linen-set',
   'Two-piece linen set: relaxed button-front shirt and wide-leg pants. Natural linen texture with a warm sand tone. Wear together or style separately — effortless versatility.',
   'a1000000-0000-0000-0000-000000000004',
   129.00, 159.00, true, true),

  ('d1000000-0000-0000-0000-000000000005',
   'Guava Slip Dress',
   'guava-slip-dress',
   'Silky slip dress in soft guava pink. Delicate spaghetti straps and a bias cut that skims the body. From beach bar to dinner — one dress, endless confidence.',
   'a1000000-0000-0000-0000-000000000001',
   79.00, null, true, false),

  ('d1000000-0000-0000-0000-000000000006',
   'Sand Dune Wide Pants',
   'sand-dune-wide-pants',
   'High-waisted wide-leg pants in toasted sand. Flowy and breathable with a clean front pleat. The kind of pants that make you feel put-together without trying.',
   'a1000000-0000-0000-0000-000000000003',
   72.00, null, true, false),

  ('d1000000-0000-0000-0000-000000000007',
   'Amber Glow Halter Top',
   'amber-glow-halter-top',
   'Halter neck top with a subtle shimmer finish. Ties at the back for adjustable fit. The amber tone catches golden hour light like it was made for it.',
   'a1000000-0000-0000-0000-000000000002',
   55.00, 69.00, true, false),

  ('d1000000-0000-0000-0000-000000000008',
   'Emerald Breeze Shorts',
   'emerald-breeze-shorts',
   'Relaxed linen shorts in soft emerald. Elastic waist with a drawstring tie. Perfect for beach days, market strolls, or just looking effortlessly cool.',
   'a1000000-0000-0000-0000-000000000003',
   45.00, null, true, false)
on conflict (slug) do nothing;

-- Product Images (using Unsplash placeholder images)
insert into public.product_images (product_id, url, alt_text, sort_order, is_primary) values
  ('d1000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80', 'Sunset Wrap Dress front', 0, true),
  ('d1000000-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&q=80', 'Sunset Wrap Dress back', 1, false),

  ('d1000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1525171254930-643fc658b64e?w=800&q=80', 'Golden Hour Crop Top front', 0, true),
  ('d1000000-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80', 'Golden Hour Crop Top styled', 1, false),

  ('d1000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800&q=80', 'Coral Breeze Midi Skirt', 0, true),
  ('d1000000-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1551163943-3f6a855d1153?w=800&q=80', 'Coral Breeze Midi Skirt detail', 1, false),

  ('d1000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80', 'Tropical Linen Set front', 0, true),
  ('d1000000-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80', 'Tropical Linen Set styled', 1, false),

  ('d1000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800&q=80', 'Guava Slip Dress', 0, true),
  ('d1000000-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1502716119720-b23a1e3b2b22?w=800&q=80', 'Guava Slip Dress back', 1, false),

  ('d1000000-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&q=80', 'Sand Dune Wide Pants', 0, true),

  ('d1000000-0000-0000-0000-000000000007', 'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=800&q=80', 'Amber Glow Halter Top', 0, true),

  ('d1000000-0000-0000-0000-000000000008', 'https://images.unsplash.com/photo-1523359346063-d879354c0ea5?w=800&q=80', 'Emerald Breeze Shorts', 0, true);

-- Product Variants (size + color + stock)
insert into public.product_variants (product_id, size, color, stock_quantity, is_active) values
  -- Sunset Wrap Dress
  ('d1000000-0000-0000-0000-000000000001', 'XS', 'Coral', 8, true),
  ('d1000000-0000-0000-0000-000000000001', 'S', 'Coral', 12, true),
  ('d1000000-0000-0000-0000-000000000001', 'M', 'Coral', 15, true),
  ('d1000000-0000-0000-0000-000000000001', 'L', 'Coral', 10, true),
  ('d1000000-0000-0000-0000-000000000001', 'XL', 'Coral', 5, true),

  -- Golden Hour Crop Top
  ('d1000000-0000-0000-0000-000000000002', 'XS', 'Mango', 10, true),
  ('d1000000-0000-0000-0000-000000000002', 'S', 'Mango', 15, true),
  ('d1000000-0000-0000-0000-000000000002', 'M', 'Mango', 20, true),
  ('d1000000-0000-0000-0000-000000000002', 'L', 'Mango', 12, true),
  ('d1000000-0000-0000-0000-000000000002', 'S', 'Ivory', 8, true),
  ('d1000000-0000-0000-0000-000000000002', 'M', 'Ivory', 10, true),
  ('d1000000-0000-0000-0000-000000000002', 'L', 'Ivory', 6, true),

  -- Coral Breeze Midi Skirt
  ('d1000000-0000-0000-0000-000000000003', 'XS', 'Coral', 5, true),
  ('d1000000-0000-0000-0000-000000000003', 'S', 'Coral', 10, true),
  ('d1000000-0000-0000-0000-000000000003', 'M', 'Coral', 12, true),
  ('d1000000-0000-0000-0000-000000000003', 'L', 'Coral', 8, true),
  ('d1000000-0000-0000-0000-000000000003', 'XL', 'Coral', 3, true),

  -- Tropical Linen Set
  ('d1000000-0000-0000-0000-000000000004', 'S', 'Sand', 6, true),
  ('d1000000-0000-0000-0000-000000000004', 'M', 'Sand', 10, true),
  ('d1000000-0000-0000-0000-000000000004', 'L', 'Sand', 8, true),
  ('d1000000-0000-0000-0000-000000000004', 'XL', 'Sand', 4, true),

  -- Guava Slip Dress
  ('d1000000-0000-0000-0000-000000000005', 'XS', 'Guava Pink', 7, true),
  ('d1000000-0000-0000-0000-000000000005', 'S', 'Guava Pink', 12, true),
  ('d1000000-0000-0000-0000-000000000005', 'M', 'Guava Pink', 15, true),
  ('d1000000-0000-0000-0000-000000000005', 'L', 'Guava Pink', 9, true),

  -- Sand Dune Wide Pants
  ('d1000000-0000-0000-0000-000000000006', 'S', 'Sand', 10, true),
  ('d1000000-0000-0000-0000-000000000006', 'M', 'Sand', 14, true),
  ('d1000000-0000-0000-0000-000000000006', 'L', 'Sand', 11, true),
  ('d1000000-0000-0000-0000-000000000006', 'XL', 'Sand', 5, true),

  -- Amber Glow Halter Top
  ('d1000000-0000-0000-0000-000000000007', 'XS', 'Amber', 6, true),
  ('d1000000-0000-0000-0000-000000000007', 'S', 'Amber', 10, true),
  ('d1000000-0000-0000-0000-000000000007', 'M', 'Amber', 12, true),
  ('d1000000-0000-0000-0000-000000000007', 'L', 'Amber', 7, true),

  -- Emerald Breeze Shorts
  ('d1000000-0000-0000-0000-000000000008', 'S', 'Emerald', 8, true),
  ('d1000000-0000-0000-0000-000000000008', 'M', 'Emerald', 12, true),
  ('d1000000-0000-0000-0000-000000000008', 'L', 'Emerald', 10, true),
  ('d1000000-0000-0000-0000-000000000008', 'XL', 'Emerald', 4, true);

-- Assign products to collections
insert into public.product_collections (product_id, collection_id) values
  -- New Arrivals (latest 4)
  ('d1000000-0000-0000-0000-000000000001', 'b0100000-0000-0000-0000-000000000001'),
  ('d1000000-0000-0000-0000-000000000002', 'b0100000-0000-0000-0000-000000000001'),
  ('d1000000-0000-0000-0000-000000000005', 'b0100000-0000-0000-0000-000000000001'),
  ('d1000000-0000-0000-0000-000000000007', 'b0100000-0000-0000-0000-000000000001'),

  -- Best Sellers
  ('d1000000-0000-0000-0000-000000000001', 'b0100000-0000-0000-0000-000000000002'),
  ('d1000000-0000-0000-0000-000000000003', 'b0100000-0000-0000-0000-000000000002'),
  ('d1000000-0000-0000-0000-000000000004', 'b0100000-0000-0000-0000-000000000002'),

  -- Summer Glow
  ('d1000000-0000-0000-0000-000000000002', 'b0100000-0000-0000-0000-000000000003'),
  ('d1000000-0000-0000-0000-000000000005', 'b0100000-0000-0000-0000-000000000003'),
  ('d1000000-0000-0000-0000-000000000007', 'b0100000-0000-0000-0000-000000000003'),
  ('d1000000-0000-0000-0000-000000000008', 'b0100000-0000-0000-0000-000000000003'),

  -- Resort Edit
  ('d1000000-0000-0000-0000-000000000001', 'b0100000-0000-0000-0000-000000000004'),
  ('d1000000-0000-0000-0000-000000000004', 'b0100000-0000-0000-0000-000000000004'),
  ('d1000000-0000-0000-0000-000000000006', 'b0100000-0000-0000-0000-000000000004'),
  ('d1000000-0000-0000-0000-000000000008', 'b0100000-0000-0000-0000-000000000004');
