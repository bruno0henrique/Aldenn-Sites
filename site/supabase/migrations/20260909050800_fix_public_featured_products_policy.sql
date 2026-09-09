drop policy if exists "public reads configured featured products"
on public.home_featured_products;

create policy "anonymous reads configured featured products"
on public.home_featured_products
for select
to anon
using (
  exists (
    select 1
    from public.products
    where products.id = home_featured_products.product_id
      and products.status = 'published'
  )
);

create policy "authenticated reads configured featured products"
on public.home_featured_products
for select
to authenticated
using (
  exists (
    select 1
    from public.products
    where products.id = home_featured_products.product_id
      and products.status = 'published'
  )
  or (select public.is_staff())
);
