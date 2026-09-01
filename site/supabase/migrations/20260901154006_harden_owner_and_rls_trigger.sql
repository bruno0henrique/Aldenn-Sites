create unique index staff_members_single_owner_idx
on public.staff_members (role)
where role = 'owner';

revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
