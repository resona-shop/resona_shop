-- Drop the old check constraint first
alter table public.orders drop constraint if exists orders_status_check;

-- Normalize any non-standard statuses
update public.orders set status = 'refunded' where status = 'partially_refunded';
update public.orders set status = 'delivered' where status = 'completed';
update public.orders set status = 'confirmed'
  where status not in ('pending','confirmed','processing','shipped','delivered','cancelled','refunded');

-- Re-add with refund_requested included
alter table public.orders add constraint orders_status_check
  check (status in ('pending','confirmed','processing','shipped','delivered','cancelled','refund_requested','refunded'));
