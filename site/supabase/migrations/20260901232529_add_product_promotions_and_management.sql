alter table public.instagram_captures
add column proposed_sale_price_cents bigint;

alter table public.products
add column sale_price_cents bigint;

alter table public.instagram_captures
add constraint instagram_captures_sale_price_valid
check (
  proposed_sale_price_cents is null
  or (
    proposed_sale_price_cents > 0
    and price_cents is not null
    and proposed_sale_price_cents < price_cents
  )
);

alter table public.products
add constraint products_sale_price_valid
check (
  sale_price_cents is null
  or (sale_price_cents > 0 and sale_price_cents < price_cents)
);

drop policy "public reads published products" on public.products;
drop policy "staff manages products" on public.products;

create policy "anonymous reads published products"
on public.products
for select
to anon
using (status = 'published');

create policy "authenticated reads products"
on public.products
for select
to authenticated
using (status = 'published' or (select public.is_staff()));

create policy "staff inserts products"
on public.products
for insert
to authenticated
with check ((select public.is_staff()));

create policy "staff updates products"
on public.products
for update
to authenticated
using ((select public.is_staff()))
with check ((select public.is_staff()));

create policy "staff deletes products"
on public.products
for delete
to authenticated
using ((select public.is_staff()));

drop policy "public reads published product media" on public.product_media;
drop policy "staff manages product media" on public.product_media;

create policy "anonymous reads published product media"
on public.product_media
for select
to anon
using (
  exists (
    select 1 from public.products p
    where p.id = product_id and p.status = 'published'
  )
);

create policy "authenticated reads product media"
on public.product_media
for select
to authenticated
using (
  exists (
    select 1 from public.products p
    where p.id = product_id
      and (p.status = 'published' or (select public.is_staff()))
  )
);

create policy "staff inserts product media"
on public.product_media
for insert
to authenticated
with check ((select public.is_staff()));

create policy "staff updates product media rows"
on public.product_media
for update
to authenticated
using ((select public.is_staff()))
with check ((select public.is_staff()));

create policy "staff deletes product media rows"
on public.product_media
for delete
to authenticated
using ((select public.is_staff()));

create or replace function public.publish_capture(target_capture_id bigint)
returns bigint
language plpgsql
security invoker
set search_path = public
as $$
declare
  target public.instagram_captures;
  published_id bigint;
  primary_count integer;
  generated_slug text;
begin
  if not public.is_staff() then raise exception 'staff access required'; end if;
  select * into target from public.instagram_captures where id = target_capture_id for update;
  if not found then raise exception 'capture not found'; end if;
  if nullif(trim(target.proposed_name), '') is null then raise exception 'product name required'; end if;
  if target.price_cents is null or target.price_cents <= 0 then raise exception 'valid price required'; end if;
  if target.proposed_sale_price_cents is not null and (
    target.proposed_sale_price_cents <= 0
    or target.proposed_sale_price_cents >= target.price_cents
  ) then raise exception 'sale price must be lower than regular price'; end if;
  select count(*) into primary_count from public.capture_media where capture_id = target_capture_id and decision = 'primary';
  if primary_count <> 1 then raise exception 'exactly one primary image required'; end if;
  generated_slug := trim(both '-' from regexp_replace(lower(target.proposed_name), '[^a-z0-9]+', '-', 'g')) || '-' || target.id;
  insert into public.products (
    source_capture_id,
    slug,
    name,
    description,
    category,
    price_cents,
    sale_price_cents,
    instagram_url,
    status
  )
  values (
    target.id,
    generated_slug,
    trim(target.proposed_name),
    nullif(trim(target.proposed_description), ''),
    nullif(trim(target.proposed_category), ''),
    target.price_cents,
    target.proposed_sale_price_cents,
    nullif(target.source_url, ''),
    'published'
  )
  on conflict (source_capture_id) do update set
    name = excluded.name,
    description = excluded.description,
    category = excluded.category,
    price_cents = excluded.price_cents,
    sale_price_cents = excluded.sale_price_cents,
    instagram_url = excluded.instagram_url,
    status = 'published',
    updated_at = now()
  returning id into published_id;
  delete from public.product_media where product_id = published_id;
  insert into public.product_media (product_id, public_url, storage_path, role, position)
  select published_id, public_url, storage_path, case when decision = 'primary' then 'primary' else 'secondary' end, row_number() over (order by case when decision = 'primary' then 0 else 1 end, source_position)::integer - 1
  from public.capture_media where capture_id = target.id and decision in ('primary','secondary');
  update public.instagram_captures set status = 'published', updated_at = now() where id = target.id;
  insert into public.audit_events (actor_user_id, action, entity_type, entity_id, payload) values ((select auth.uid()), 'publish', 'product', published_id, jsonb_build_object('capture_id', target.id));
  return published_id;
end;
$$;

create or replace function public.update_published_product(
  target_product_id bigint,
  new_name text,
  new_description text,
  new_category text,
  new_price_cents bigint,
  new_sale_price_cents bigint
)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  target_capture_id bigint;
begin
  if not public.is_staff() then raise exception 'staff access required'; end if;
  if nullif(trim(new_name), '') is null then raise exception 'product name required'; end if;
  if new_price_cents is null or new_price_cents <= 0 then raise exception 'valid price required'; end if;
  if new_sale_price_cents is not null and (
    new_sale_price_cents <= 0
    or new_sale_price_cents >= new_price_cents
  ) then raise exception 'sale price must be lower than regular price'; end if;

  update public.products
  set
    name = trim(new_name),
    description = nullif(trim(new_description), ''),
    category = nullif(trim(new_category), ''),
    price_cents = new_price_cents,
    sale_price_cents = new_sale_price_cents,
    updated_at = now()
  where id = target_product_id
  returning source_capture_id into target_capture_id;

  if not found then raise exception 'product not found'; end if;

  update public.instagram_captures
  set
    proposed_name = trim(new_name),
    proposed_description = nullif(trim(new_description), ''),
    proposed_category = nullif(trim(new_category), ''),
    price_cents = new_price_cents,
    proposed_sale_price_cents = new_sale_price_cents,
    updated_at = now()
  where id = target_capture_id;

  insert into public.audit_events (actor_user_id, action, entity_type, entity_id, payload)
  values (
    (select auth.uid()),
    'update',
    'product',
    target_product_id,
    jsonb_build_object('sale_price_cents', new_sale_price_cents)
  );
end;
$$;

create or replace function public.remove_published_product(target_product_id bigint)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  target_capture_id bigint;
begin
  if not public.is_staff() then raise exception 'staff access required'; end if;

  select source_capture_id into target_capture_id
  from public.products
  where id = target_product_id
  for update;

  if not found then raise exception 'product not found'; end if;

  delete from public.products where id = target_product_id;
  update public.instagram_captures
  set status = 'ignored', updated_at = now()
  where id = target_capture_id;

  insert into public.audit_events (actor_user_id, action, entity_type, entity_id, payload)
  values (
    (select auth.uid()),
    'delete',
    'product',
    target_product_id,
    jsonb_build_object('capture_id', target_capture_id)
  );
end;
$$;

revoke all on function public.publish_capture(bigint) from public;
revoke all on function public.update_published_product(bigint, text, text, text, bigint, bigint) from public;
revoke all on function public.remove_published_product(bigint) from public;

grant execute on function public.publish_capture(bigint) to authenticated;
grant execute on function public.update_published_product(bigint, text, text, text, bigint, bigint) to authenticated;
grant execute on function public.remove_published_product(bigint) to authenticated;
