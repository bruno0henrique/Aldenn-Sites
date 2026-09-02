create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create table public.catalog_categories (
  id bigint generated always as identity primary key,
  name text not null check (char_length(trim(name)) between 2 and 60),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  sort_order integer not null default 0 check (sort_order >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index catalog_categories_name_unique_idx
on public.catalog_categories (lower(name));

create index catalog_categories_active_order_idx
on public.catalog_categories (sort_order, name)
where is_active;

create table public.home_banners (
  id bigint generated always as identity primary key,
  product_id bigint not null references public.products(id) on delete cascade,
  media_position integer not null default 0 check (media_position >= 0),
  sort_order integer not null default 0 check (sort_order >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (product_id, media_position)
);

create index home_banners_product_id_idx on public.home_banners (product_id);
create index home_banners_active_order_idx
on public.home_banners (sort_order, id)
where is_active;

alter table public.catalog_categories enable row level security;
alter table public.home_banners enable row level security;

create policy "anonymous reads active catalog categories"
on public.catalog_categories
for select
to anon
using (is_active);

create policy "authenticated reads catalog categories"
on public.catalog_categories
for select
to authenticated
using (is_active or (select public.is_staff()));

create policy "staff inserts catalog categories"
on public.catalog_categories
for insert
to authenticated
with check ((select public.is_staff()));

create policy "staff updates catalog categories"
on public.catalog_categories
for update
to authenticated
using ((select public.is_staff()))
with check ((select public.is_staff()));

create policy "anonymous reads active home banners"
on public.home_banners
for select
to anon
using (
  is_active
  and exists (
    select 1
    from public.products
    where products.id = home_banners.product_id
      and products.status = 'published'
  )
);

create policy "authenticated reads home banners"
on public.home_banners
for select
to authenticated
using (
  (
    is_active
    and exists (
      select 1
      from public.products
      where products.id = home_banners.product_id
        and products.status = 'published'
    )
  )
  or (select public.is_staff())
);

create policy "staff inserts home banners"
on public.home_banners
for insert
to authenticated
with check ((select public.is_staff()));

create policy "staff updates home banners"
on public.home_banners
for update
to authenticated
using ((select public.is_staff()))
with check ((select public.is_staff()));

create policy "staff deletes home banners"
on public.home_banners
for delete
to authenticated
using ((select public.is_staff()));

grant select on public.catalog_categories, public.home_banners to anon;
grant select, insert, update on public.catalog_categories to authenticated;
grant select, insert, update, delete on public.home_banners to authenticated;
grant usage, select on sequence public.catalog_categories_id_seq to authenticated;
grant usage, select on sequence public.home_banners_id_seq to authenticated;

create or replace function private.touch_storefront_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger catalog_categories_touch_updated_at
before update on public.catalog_categories
for each row execute function private.touch_storefront_updated_at();

create trigger home_banners_touch_updated_at
before update on public.home_banners
for each row execute function private.touch_storefront_updated_at();

create or replace function private.sync_catalog_category_name()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if new.name is distinct from old.name then
    update public.products
    set category = trim(new.name), updated_at = now()
    where lower(trim(category)) = lower(trim(old.name));

    update public.instagram_captures
    set proposed_category = trim(new.name), updated_at = now()
    where lower(trim(proposed_category)) = lower(trim(old.name));
  end if;
  return new;
end;
$$;

create trigger catalog_categories_sync_name
after update of name on public.catalog_categories
for each row execute function private.sync_catalog_category_name();

create or replace function private.audit_storefront_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  target_id bigint;
  audit_action text;
  safe_payload jsonb;
  row_data jsonb;
begin
  row_data := case when tg_op = 'DELETE' then to_jsonb(old) else to_jsonb(new) end;
  target_id := (row_data ->> 'id')::bigint;
  audit_action := lower(tg_op);
  safe_payload := case
    when tg_table_name = 'catalog_categories' then
      jsonb_build_object(
        'name', row_data ->> 'name',
        'slug', row_data ->> 'slug',
        'active', (row_data ->> 'is_active')::boolean
      )
    else
      jsonb_build_object(
        'product_id', (row_data ->> 'product_id')::bigint,
        'media_position', (row_data ->> 'media_position')::integer,
        'active', (row_data ->> 'is_active')::boolean
      )
  end;

  insert into public.audit_events (
    actor_user_id,
    action,
    entity_type,
    entity_id,
    payload
  ) values (
    (select auth.uid()),
    audit_action,
    tg_table_name,
    target_id,
    safe_payload
  );

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

create trigger catalog_categories_audit
after insert or update or delete on public.catalog_categories
for each row execute function private.audit_storefront_change();

create trigger home_banners_audit
after insert or update or delete on public.home_banners
for each row execute function private.audit_storefront_change();

insert into public.catalog_categories (name, slug, sort_order)
values
  ('Body', 'body', 10),
  ('Cropped', 'cropped', 20),
  ('Conjuntos', 'conjuntos', 30),
  ('Vestidos', 'vestidos', 40),
  ('Corselets', 'corselets', 50),
  ('Saias', 'saias', 60),
  ('Batas', 'batas', 70),
  ('Tops', 'tops', 80),
  ('Básicos', 'basicos', 90)
on conflict do nothing;

insert into public.catalog_categories (name, slug, sort_order)
select
  source.name,
  case
    when source.slug = '' then 'categoria-' || substr(md5(source.name), 1, 8)
    when exists (
      select 1 from public.catalog_categories existing where existing.slug = source.slug
    ) then source.slug || '-' || substr(md5(source.name), 1, 6)
    else source.slug
  end,
  100 + row_number() over (order by source.name) * 10
from (
  select distinct on (lower(trim(category)))
    trim(category) as name,
    trim(both '-' from regexp_replace(
      translate(
        lower(trim(category)),
        'áàâãäéèêëíìîïóòôõöúùûüç',
        'aaaaaeeeeiiiiooooouuuuc'
      ),
      '[^a-z0-9]+',
      '-',
      'g'
    )) as slug
  from public.products
  where nullif(trim(category), '') is not null
  order by lower(trim(category)), trim(category)
) source
where lower(source.name) <> 'novidades'
  and not exists (
    select 1
    from public.catalog_categories existing
    where lower(existing.name) = lower(source.name)
  )
on conflict do nothing;
