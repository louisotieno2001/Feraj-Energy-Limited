-- Fix profiles role constraint to match current app roles.
-- Run this in Supabase SQL Editor.

begin;

-- Normalize legacy values first.
update public.profiles
set role = 'employee'
where lower(trim(role)) in ('installer', 'employee');

update public.profiles
set role = 'co_admin'
where lower(trim(role)) in ('co-admin', 'coadmin', 'co admin', 'co_admin');

update public.profiles
set role = 'customer'
where lower(trim(role)) = 'client';

-- Recreate role check with supported values.
alter table public.profiles
  drop constraint if exists profiles_role_check;

alter table public.profiles
  add constraint profiles_role_check
  check (role in ('customer', 'employee', 'co_admin', 'admin'));

-- Optional sanity check for quick visibility in SQL editor results.
select id, email, role
from public.profiles
where role not in ('customer', 'employee', 'co_admin', 'admin');

commit;
