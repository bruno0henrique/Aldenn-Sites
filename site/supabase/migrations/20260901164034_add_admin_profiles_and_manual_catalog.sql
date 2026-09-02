alter table public.staff_members
drop constraint staff_members_role_check;

alter table public.staff_members
add constraint staff_members_role_check
check (role in ('owner', 'admin'));

create or replace function public.is_staff()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select exists (
    select 1
    from public.staff_members
    where user_id = (select auth.uid())
      and role in ('owner', 'admin')
  );
$$;

revoke all on function public.is_staff() from public, anon;
grant execute on function public.is_staff() to authenticated;

drop policy "owner manages captures" on public.instagram_captures;
create policy "staff manages captures"
on public.instagram_captures
for all
to authenticated
using ((select public.is_staff()))
with check ((select public.is_staff()));

drop policy "owner manages captured media" on public.capture_media;
create policy "staff manages captured media"
on public.capture_media
for all
to authenticated
using ((select public.is_staff()))
with check ((select public.is_staff()));

drop policy "owner manages products" on public.products;
create policy "staff manages products"
on public.products
for all
to authenticated
using ((select public.is_staff()))
with check ((select public.is_staff()));

drop policy "owner manages product media" on public.product_media;
create policy "staff manages product media"
on public.product_media
for all
to authenticated
using ((select public.is_staff()))
with check ((select public.is_staff()));

drop policy "owner reads audit" on public.audit_events;
create policy "staff reads audit"
on public.audit_events
for select
to authenticated
using ((select public.is_staff()));

drop policy "owner writes audit" on public.audit_events;
create policy "staff writes audit"
on public.audit_events
for insert
to authenticated
with check ((select public.is_staff()));

alter table public.customer_profiles
add column full_name text,
add column phone text;

alter table public.customer_profiles
add constraint customer_profiles_full_name_length
check (full_name is null or char_length(full_name) between 2 and 120),
add constraint customer_profiles_phone_length
check (phone is null or char_length(phone) between 8 and 24);

create policy "customers update own profile"
on public.customer_profiles
for update
to authenticated
using (user_id = (select auth.uid()))
with check (user_id = (select auth.uid()));

grant update (full_name, phone, marketing_opt_in, marketing_opt_in_at, updated_at)
on public.customer_profiles
to authenticated;

create policy "staff uploads product media"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'product-media' and (select public.is_staff()));

create policy "staff updates product media"
on storage.objects
for update
to authenticated
using (bucket_id = 'product-media' and (select public.is_staff()))
with check (bucket_id = 'product-media' and (select public.is_staff()));

create policy "staff removes product media"
on storage.objects
for delete
to authenticated
using (bucket_id = 'product-media' and (select public.is_staff()));

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
  select count(*) into primary_count from public.capture_media where capture_id = target_capture_id and decision = 'primary';
  if primary_count <> 1 then raise exception 'exactly one primary image required'; end if;
  generated_slug := trim(both '-' from regexp_replace(lower(target.proposed_name), '[^a-z0-9]+', '-', 'g')) || '-' || target.id;
  insert into public.products (source_capture_id, slug, name, description, category, price_cents, instagram_url, status)
  values (target.id, generated_slug, trim(target.proposed_name), nullif(trim(target.proposed_description), ''), nullif(trim(target.proposed_category), ''), target.price_cents, nullif(target.source_url, ''), 'published')
  on conflict (source_capture_id) do update set name = excluded.name, description = excluded.description, category = excluded.category, price_cents = excluded.price_cents, instagram_url = excluded.instagram_url, status = 'published', updated_at = now()
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

revoke all on function public.publish_capture(bigint) from public;
grant execute on function public.publish_capture(bigint) to authenticated;
