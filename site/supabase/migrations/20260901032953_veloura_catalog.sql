create table public.staff_members (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('owner')),
  created_at timestamptz not null default now()
);

create function public.is_owner()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.staff_members
    where user_id = (select auth.uid()) and role = 'owner'
  );
$$;

revoke all on function public.is_owner() from public;
grant execute on function public.is_owner() to authenticated;

create table public.instagram_captures (
  id bigint generated always as identity primary key,
  instagram_shortcode text not null unique,
  source_url text not null,
  raw_caption text,
  captured_at timestamptz not null,
  status text not null default 'pending_review' check (status in ('pending_review','in_review','publishing','published','ignored','error')),
  proposed_name text,
  proposed_description text,
  proposed_category text,
  price_cents bigint check (price_cents is null or price_cents > 0),
  source_missing boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.capture_media (
  id bigint generated always as identity primary key,
  capture_id bigint not null references public.instagram_captures(id) on delete cascade,
  source_position integer not null check (source_position >= 0),
  source_url text not null,
  storage_path text not null,
  public_url text not null,
  mime_type text not null check (mime_type like 'image/%'),
  decision text not null default 'pending' check (decision in ('pending','primary','secondary','discarded')),
  created_at timestamptz not null default now(),
  unique (capture_id, source_position)
);

create unique index capture_media_one_primary_idx on public.capture_media (capture_id) where decision = 'primary';
create index capture_media_capture_position_idx on public.capture_media (capture_id, source_position);
create index captures_status_captured_idx on public.instagram_captures (status, captured_at);

create table public.products (
  id bigint generated always as identity primary key,
  source_capture_id bigint not null unique references public.instagram_captures(id),
  slug text not null unique,
  name text not null,
  description text,
  category text,
  price_cents bigint not null check (price_cents > 0),
  currency text not null default 'BRL' check (currency = 'BRL'),
  status text not null default 'published' check (status in ('published','unpublished')),
  instagram_url text,
  published_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index products_status_published_idx on public.products (status, published_at desc);

create table public.product_media (
  id bigint generated always as identity primary key,
  product_id bigint not null references public.products(id) on delete cascade,
  public_url text not null,
  storage_path text not null,
  role text not null check (role in ('primary','secondary')),
  position integer not null check (position >= 0),
  unique (product_id, position)
);

create unique index product_media_one_primary_idx on public.product_media (product_id) where role = 'primary';
create index product_media_product_position_idx on public.product_media (product_id, position);

create table public.audit_events (
  id bigint generated always as identity primary key,
  actor_user_id uuid references auth.users(id) on delete set null,
  action text not null,
  entity_type text not null,
  entity_id bigint,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index audit_events_entity_idx on public.audit_events (entity_type, entity_id, created_at desc);

alter table public.staff_members enable row level security;
alter table public.instagram_captures enable row level security;
alter table public.capture_media enable row level security;
alter table public.products enable row level security;
alter table public.product_media enable row level security;
alter table public.audit_events enable row level security;

create policy "staff can read own membership" on public.staff_members for select to authenticated using (user_id = (select auth.uid()));
create policy "owner manages captures" on public.instagram_captures for all to authenticated using ((select public.is_owner())) with check ((select public.is_owner()));
create policy "owner manages captured media" on public.capture_media for all to authenticated using ((select public.is_owner())) with check ((select public.is_owner()));
create policy "public reads published products" on public.products for select to anon, authenticated using (status = 'published' or (select public.is_owner()));
create policy "owner manages products" on public.products for all to authenticated using ((select public.is_owner())) with check ((select public.is_owner()));
create policy "public reads published product media" on public.product_media for select to anon, authenticated using (exists (select 1 from public.products p where p.id = product_id and (p.status = 'published' or (select public.is_owner()))));
create policy "owner manages product media" on public.product_media for all to authenticated using ((select public.is_owner())) with check ((select public.is_owner()));
create policy "owner reads audit" on public.audit_events for select to authenticated using ((select public.is_owner()));
create policy "owner writes audit" on public.audit_events for insert to authenticated with check ((select public.is_owner()));

grant select on public.products, public.product_media to anon;
grant select on public.staff_members to authenticated;
grant select, insert, update, delete on public.instagram_captures, public.capture_media, public.products, public.product_media to authenticated;
grant select, insert on public.audit_events to authenticated;
grant usage, select on all sequences in schema public to authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-media', 'product-media', true, 10485760, array['image/jpeg','image/png','image/webp'])
on conflict (id) do update set public = excluded.public, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create function public.publish_capture(target_capture_id bigint)
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
  if not public.is_owner() then raise exception 'owner access required'; end if;
  select * into target from public.instagram_captures where id = target_capture_id for update;
  if not found then raise exception 'capture not found'; end if;
  if nullif(trim(target.proposed_name), '') is null then raise exception 'product name required'; end if;
  if target.price_cents is null or target.price_cents <= 0 then raise exception 'valid price required'; end if;
  select count(*) into primary_count from public.capture_media where capture_id = target_capture_id and decision = 'primary';
  if primary_count <> 1 then raise exception 'exactly one primary image required'; end if;
  generated_slug := trim(both '-' from regexp_replace(lower(target.proposed_name), '[^a-z0-9]+', '-', 'g')) || '-' || target.id;
  insert into public.products (source_capture_id, slug, name, description, category, price_cents, instagram_url, status)
  values (target.id, generated_slug, trim(target.proposed_name), nullif(trim(target.proposed_description), ''), nullif(trim(target.proposed_category), ''), target.price_cents, target.source_url, 'published')
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
