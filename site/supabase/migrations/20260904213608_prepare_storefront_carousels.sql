alter table public.home_banners
alter column product_id drop not null;

alter table public.home_banners
add column image_url text,
add column storage_path text,
add column eyebrow text,
add column title text,
add column description text,
add column cta_label text,
add column cta_url text,
add constraint home_banners_source_check
  check (product_id is not null or nullif(trim(image_url), '') is not null),
add constraint home_banners_eyebrow_length
  check (eyebrow is null or char_length(eyebrow) <= 40),
add constraint home_banners_title_length
  check (title is null or char_length(title) <= 90),
add constraint home_banners_description_length
  check (description is null or char_length(description) <= 180),
add constraint home_banners_cta_label_length
  check (cta_label is null or char_length(cta_label) <= 32),
add constraint home_banners_cta_url_length
  check (cta_url is null or char_length(cta_url) <= 500);

drop policy if exists "anonymous reads active home banners" on public.home_banners;
drop policy if exists "authenticated reads home banners" on public.home_banners;

create policy "anonymous reads active home banners"
on public.home_banners
for select
to anon
using (
  is_active
  and (
    (
      product_id is null
      and nullif(trim(image_url), '') is not null
    )
    or exists (
      select 1
      from public.products
      where products.id = home_banners.product_id
        and products.status = 'published'
    )
  )
);

create policy "authenticated reads home banners"
on public.home_banners
for select
to authenticated
using (
  (
    is_active
    and (
      (
        product_id is null
        and nullif(trim(image_url), '') is not null
      )
      or exists (
        select 1
        from public.products
        where products.id = home_banners.product_id
          and products.status = 'published'
      )
    )
  )
  or (select public.is_staff())
);

create table public.home_featured_products (
  id bigint generated always as identity primary key,
  product_id bigint not null unique references public.products(id) on delete cascade,
  sort_order integer not null default 0 check (sort_order >= 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index home_featured_products_active_order_idx
on public.home_featured_products (sort_order, id)
where is_active;

alter table public.home_featured_products enable row level security;

create policy "public reads configured featured products"
on public.home_featured_products
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.products
    where products.id = home_featured_products.product_id
      and products.status = 'published'
  )
  or (select public.is_staff())
);

create policy "staff inserts featured products"
on public.home_featured_products
for insert
to authenticated
with check ((select public.is_staff()));

create policy "staff updates featured products"
on public.home_featured_products
for update
to authenticated
using ((select public.is_staff()))
with check ((select public.is_staff()));

create policy "staff deletes featured products"
on public.home_featured_products
for delete
to authenticated
using ((select public.is_staff()));

grant select on public.home_featured_products to anon;
grant select, insert, update, delete on public.home_featured_products to authenticated;
grant usage, select on sequence public.home_featured_products_id_seq to authenticated;

create trigger home_featured_products_touch_updated_at
before update on public.home_featured_products
for each row execute function private.touch_storefront_updated_at();
