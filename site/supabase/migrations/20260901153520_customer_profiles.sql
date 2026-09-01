create schema if not exists private;

create or replace function public.is_owner()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select exists (
    select 1
    from public.staff_members
    where user_id = (select auth.uid()) and role = 'owner'
  );
$$;

create table public.customer_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  marketing_opt_in boolean not null default false,
  marketing_opt_in_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.customer_profiles enable row level security;

create policy "customers read own profile"
on public.customer_profiles
for select
to authenticated
using (user_id = (select auth.uid()) or (select public.is_owner()));

grant select on public.customer_profiles to authenticated;
revoke all on public.customer_profiles from anon;

create or replace function private.sync_customer_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  wants_marketing boolean;
begin
  if new.email is null then
    return new;
  end if;

  wants_marketing := coalesce(new.raw_user_meta_data ->> 'marketing_opt_in', 'false') = 'true';

  insert into public.customer_profiles (
    user_id,
    email,
    marketing_opt_in,
    marketing_opt_in_at,
    updated_at
  )
  values (
    new.id,
    lower(new.email),
    wants_marketing,
    case when wants_marketing then now() else null end,
    now()
  )
  on conflict (user_id) do update
  set email = excluded.email,
      marketing_opt_in = excluded.marketing_opt_in,
      marketing_opt_in_at = case
        when excluded.marketing_opt_in and not public.customer_profiles.marketing_opt_in
          then now()
        when not excluded.marketing_opt_in
          then null
        else public.customer_profiles.marketing_opt_in_at
      end,
      updated_at = now();

  return new;
end;
$$;

revoke all on function private.sync_customer_profile() from public, anon, authenticated;

create trigger sync_customer_profile_after_auth_change
after insert or update of email, raw_user_meta_data on auth.users
for each row execute function private.sync_customer_profile();
