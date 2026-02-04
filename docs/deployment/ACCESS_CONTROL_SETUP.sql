-- Access control setup for roles, permissions, audit logs, and tickets
-- Run in Supabase SQL editor

-- 1) Ensure role enum logic is handled at application level
--    Profiles role values: 'customer', 'employee', 'co_admin', 'admin'

-- 2) User permissions table
create table if not exists public.user_permissions (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  can_manage_products boolean not null default false,
  can_manage_tickets boolean not null default false,
  can_promote_to_co_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3) Audit logs table
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_user_id uuid references public.profiles(id) on delete set null,
  target_user_id uuid references public.profiles(id) on delete set null,
  action text not null,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_created_at_idx on public.audit_logs(created_at desc);

-- 4) Tickets table
create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references public.profiles(id) on delete cascade,
  assigned_to uuid references public.profiles(id) on delete set null,
  status text not null check (status in ('open', 'in_progress', 'resolved')) default 'open',
  subject text not null,
  message text not null,
  response text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tickets_status_idx on public.tickets(status);

-- 5) RLS
alter table public.user_permissions enable row level security;
alter table public.audit_logs enable row level security;
alter table public.tickets enable row level security;

-- 6) Policies
-- Admins can manage all permissions
drop policy if exists "Admins manage permissions" on public.user_permissions;
create policy "Admins manage permissions"
on public.user_permissions
for all
to authenticated
using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
)
with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

-- Co-admins can manage permissions for employees and customers only
drop policy if exists "Co-admins manage employee/customer permissions" on public.user_permissions;
create policy "Co-admins manage employee/customer permissions"
on public.user_permissions
for all
to authenticated
using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'co_admin')
  and exists (select 1 from public.profiles t where t.id = user_id and t.role in ('employee', 'customer'))
)
with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'co_admin')
  and exists (select 1 from public.profiles t where t.id = user_id and t.role in ('employee', 'customer'))
);

-- Staff can read audit logs
drop policy if exists "Staff can read audit logs" on public.audit_logs;
create policy "Staff can read audit logs"
on public.audit_logs
for select
to authenticated
using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'co_admin', 'employee'))
);

-- Admins and co-admins can insert audit logs
drop policy if exists "Staff can write audit logs" on public.audit_logs;
create policy "Staff can write audit logs"
on public.audit_logs
for insert
to authenticated
with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'co_admin', 'employee'))
);

-- Staff can read tickets
drop policy if exists "Staff can read tickets" on public.tickets;
create policy "Staff can read tickets"
on public.tickets
for select
to authenticated
using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role in ('admin', 'co_admin', 'employee'))
);

-- Admins/co-admins can update tickets; employees only with permission
drop policy if exists "Staff can update tickets" on public.tickets;
create policy "Staff can update tickets"
on public.tickets
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    left join public.user_permissions up on up.user_id = p.id
    where p.id = auth.uid()
      and (
        p.role in ('admin', 'co_admin')
        or (p.role = 'employee' and up.can_manage_tickets = true)
      )
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    left join public.user_permissions up on up.user_id = p.id
    where p.id = auth.uid()
      and (
        p.role in ('admin', 'co_admin')
        or (p.role = 'employee' and up.can_manage_tickets = true)
      )
  )
);

-- Allow customers to create tickets (optional; remove if you want staff-only ticket creation)
drop policy if exists "Customers can create tickets" on public.tickets;
create policy "Customers can create tickets"
on public.tickets
for insert
to authenticated
with check (auth.uid() = created_by);

-- 8) Profile role management policies
alter table public.profiles enable row level security;

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
on public.profiles
for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

drop policy if exists "Admins can update any profile" on public.profiles;
create policy "Admins can update any profile"
on public.profiles
for update
to authenticated
using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
)
with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin')
);

drop policy if exists "Co-admins can update employee/customer profiles" on public.profiles;
create policy "Co-admins can update employee/customer profiles"
on public.profiles
for update
to authenticated
using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'co_admin')
  and role in ('employee', 'customer')
)
with check (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'co_admin')
  and role in ('employee', 'customer')
);

-- 7) Products policies update (align with role/permission model)
-- Drop existing admin-only policies if needed, then apply:
drop policy if exists "Admins can view all products" on public.products;
drop policy if exists "Admins can insert products" on public.products;
drop policy if exists "Admins can update products" on public.products;
drop policy if exists "Admins can delete products" on public.products;

create policy "Staff can view all products"
on public.products
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    left join public.user_permissions up on up.user_id = p.id
    where p.id = auth.uid()
      and (
        p.role in ('admin', 'co_admin')
        or (p.role = 'employee' and up.can_manage_products = true)
      )
  )
);

create policy "Staff can insert products"
on public.products
for insert
to authenticated
with check (
  exists (
    select 1
    from public.profiles p
    left join public.user_permissions up on up.user_id = p.id
    where p.id = auth.uid()
      and (
        p.role in ('admin', 'co_admin')
        or (p.role = 'employee' and up.can_manage_products = true)
      )
  )
);

create policy "Staff can update products"
on public.products
for update
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    left join public.user_permissions up on up.user_id = p.id
    where p.id = auth.uid()
      and (
        p.role in ('admin', 'co_admin')
        or (p.role = 'employee' and up.can_manage_products = true)
      )
  )
)
with check (
  exists (
    select 1
    from public.profiles p
    left join public.user_permissions up on up.user_id = p.id
    where p.id = auth.uid()
      and (
        p.role in ('admin', 'co_admin')
        or (p.role = 'employee' and up.can_manage_products = true)
      )
  )
);

create policy "Staff can delete products"
on public.products
for delete
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    left join public.user_permissions up on up.user_id = p.id
    where p.id = auth.uid()
      and (
        p.role in ('admin', 'co_admin')
        or (p.role = 'employee' and up.can_manage_products = true)
      )
  )
);
