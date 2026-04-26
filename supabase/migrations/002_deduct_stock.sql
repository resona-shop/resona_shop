-- ============================================
-- Stock deduction function
-- Run this in Supabase SQL Editor
-- ============================================

create or replace function public.deduct_stock(
  p_variant_id uuid,
  p_quantity int
)
returns void as $$
begin
  update public.product_variants
  set stock_quantity = greatest(stock_quantity - p_quantity, 0)
  where id = p_variant_id;
end;
$$ language plpgsql security definer;
