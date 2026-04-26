-- Order shipping/tracking fields + edit support
-- Run this in Supabase SQL Editor

alter table public.orders add column if not exists shipping_carrier text;
alter table public.orders add column if not exists tracking_number text;
alter table public.orders add column if not exists shipped_at timestamptz;
alter table public.orders add column if not exists delivered_at timestamptz;
