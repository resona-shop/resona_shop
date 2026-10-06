-- Order emails, and all-or-nothing admin saves

-- Guests have no profile, so the address Stripe collected is kept on the order.
alter table public.orders add column if not exists customer_email text;

-- ============================================
-- Save a product with its images and variants in one transaction.
-- Runs with the caller's rights, so RLS still applies.
--   p_id       null to create
--   p_images   null leaves images untouched
--   p_variants null leaves variants untouched
-- ============================================
create or replace function public.admin_save_product(
  p_id uuid,
  p_product jsonb,
  p_images jsonb,
  p_variants jsonb
)
returns uuid as $$
declare
  v_id uuid;
  v_variant jsonb;
  v_existing uuid;
  v_keep uuid[];
begin
  if not public.is_admin() then
    raise exception 'Unauthorized';
  end if;

  if p_id is null then
    insert into public.products (
      name, slug, description, category_id, base_price, compare_at_price,
      is_active, is_featured
    )
    values (
      p_product->>'name',
      p_product->>'slug',
      p_product->>'description',
      nullif(p_product->>'category_id', '')::uuid,
      (p_product->>'base_price')::numeric,
      nullif(p_product->>'compare_at_price', '')::numeric,
      coalesce((p_product->>'is_active')::boolean, true),
      coalesce((p_product->>'is_featured')::boolean, false)
    )
    returning id into v_id;
  else
    update public.products set
      name = p_product->>'name',
      slug = coalesce(nullif(p_product->>'slug', ''), slug),
      description = p_product->>'description',
      category_id = nullif(p_product->>'category_id', '')::uuid,
      base_price = (p_product->>'base_price')::numeric,
      compare_at_price = nullif(p_product->>'compare_at_price', '')::numeric,
      is_active = coalesce((p_product->>'is_active')::boolean, true),
      is_featured = coalesce((p_product->>'is_featured')::boolean, false)
    where id = p_id;

    if not found then
      raise exception 'Product not found';
    end if;
    v_id := p_id;
  end if;

  if p_images is not null then
    delete from public.product_images where product_id = v_id;
    insert into public.product_images (product_id, url, is_primary, sort_order)
    select
      v_id,
      img->>'url',
      coalesce((img->>'is_primary')::boolean, false),
      coalesce((img->>'sort_order')::int, 0)
    from jsonb_array_elements(p_images) as img;
  end if;

  if p_variants is not null then
    select coalesce(array_agg((item->>'id')::uuid), '{}')
    into v_keep
    from jsonb_array_elements(p_variants) as item
    where nullif(item->>'id', '') is not null;

    -- Variants are kept by id: orders and carts reference them.
    for v_existing in
      select id from public.product_variants
      where product_id = v_id and id <> all (v_keep)
    loop
      begin
        delete from public.product_variants where id = v_existing;
      exception when foreign_key_violation then
        -- Already ordered, so it cannot be deleted: retire it instead.
        update public.product_variants
        set is_active = false, stock_quantity = 0
        where id = v_existing;
      end;
    end loop;

    for v_variant in select * from jsonb_array_elements(p_variants)
    loop
      if nullif(v_variant->>'id', '') is not null and exists (
        select 1 from public.product_variants
        where id = (v_variant->>'id')::uuid and product_id = v_id
      ) then
        update public.product_variants set
          size = v_variant->>'size',
          color = v_variant->>'color',
          sku = nullif(v_variant->>'sku', ''),
          price_override = nullif(v_variant->>'price_override', '')::numeric,
          stock_quantity = greatest(coalesce((v_variant->>'stock_quantity')::int, 0), 0),
          is_active = coalesce((v_variant->>'is_active')::boolean, true)
        where id = (v_variant->>'id')::uuid;
      else
        insert into public.product_variants (
          product_id, size, color, sku, price_override, stock_quantity, is_active
        )
        values (
          v_id,
          v_variant->>'size',
          v_variant->>'color',
          nullif(v_variant->>'sku', ''),
          nullif(v_variant->>'price_override', '')::numeric,
          greatest(coalesce((v_variant->>'stock_quantity')::int, 0), 0),
          coalesce((v_variant->>'is_active')::boolean, true)
        );
      end if;
    end loop;
  end if;

  return v_id;
end;
$$ language plpgsql security invoker set search_path = public;

-- ============================================
-- Replace a collection's products in one transaction.
-- ============================================
create or replace function public.admin_set_collection_products(
  p_collection_id uuid,
  p_product_ids uuid[]
)
returns void as $$
begin
  if not public.is_admin() then
    raise exception 'Unauthorized';
  end if;

  delete from public.product_collections where collection_id = p_collection_id;

  insert into public.product_collections (collection_id, product_id)
  select p_collection_id, pid
  from unnest(coalesce(p_product_ids, '{}')) as pid;
end;
$$ language plpgsql security invoker set search_path = public;

revoke execute on function public.admin_save_product(uuid, jsonb, jsonb, jsonb) from public, anon;
revoke execute on function public.admin_set_collection_products(uuid, uuid[]) from public, anon;
grant execute on function public.admin_save_product(uuid, jsonb, jsonb, jsonb) to authenticated;
grant execute on function public.admin_set_collection_products(uuid, uuid[]) to authenticated;
