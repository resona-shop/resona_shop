-- Newsletter subscribers table
-- Run this in Supabase SQL Editor

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table public.newsletter_subscribers enable row level security;

create policy "Admin read subscribers" on public.newsletter_subscribers
  for select using (public.is_admin());

create policy "Anyone can subscribe" on public.newsletter_subscribers
  for insert with check (true);
