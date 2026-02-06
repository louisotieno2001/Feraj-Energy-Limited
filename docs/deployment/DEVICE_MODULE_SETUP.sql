-- Device Registration & Monitoring Module (Supabase/Postgres)
-- Requires pgcrypto for key generation + hashing.
create extension if not exists pgcrypto;

-- Helper: staff check
create or replace function public.is_staff()
returns boolean
language sql
stable
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('admin', 'co_admin', 'employee')
  );
$$;

-- Inventory of provisioned devices (before activation)
create table if not exists public.device_inventory (
  id uuid primary key default gen_random_uuid(),
  serial_number text not null unique,
  mac_address text unique,
  qr_code text unique,
  device_type text not null,
  device_key_hash text,
  status text not null default 'available',
  provisioned_at timestamptz not null default now(),
  metadata jsonb
);

-- Active devices
create table if not exists public.devices (
  id uuid primary key default gen_random_uuid(),
  inventory_id uuid references public.device_inventory(id),
  serial_number text not null unique,
  mac_address text,
  qr_code text,
  device_type text not null,
  location text,
  installation_date date,
  customer_id uuid references auth.users(id),
  assigned_by uuid references auth.users(id),
  status text not null default 'active',
  last_seen_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Device API keys (hashed)
create table if not exists public.device_api_keys (
  id uuid primary key default gen_random_uuid(),
  device_id uuid not null references public.devices(id) on delete cascade,
  key_hash text not null unique,
  created_at timestamptz not null default now(),
  revoked_at timestamptz
);

-- Device registration requests
create table if not exists public.device_registrations (
  id uuid primary key default gen_random_uuid(),
  serial_number text not null,
  method text not null,
  requested_by uuid references auth.users(id),
  status text not null default 'pending',
  metadata jsonb,
  bulk_batch_id text,
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

-- Telemetry (time-series)
create table if not exists public.device_telemetry (
  id bigserial primary key,
  device_id uuid not null references public.devices(id) on delete cascade,
  recorded_at timestamptz not null default now(),
  voltage numeric,
  current numeric,
  power_output numeric,
  energy_generated numeric,
  battery_level numeric,
  temperature numeric,
  fault_code text,
  status text,
  raw jsonb
);

create index if not exists device_telemetry_device_id_idx
  on public.device_telemetry(device_id);
create index if not exists device_telemetry_recorded_at_idx
  on public.device_telemetry(recorded_at desc);

-- Latest telemetry view
create or replace view public.device_latest_telemetry as
select distinct on (device_id)
  device_id,
  recorded_at,
  voltage,
  current,
  power_output,
  energy_generated,
  battery_level,
  temperature,
  fault_code,
  status,
  raw
from public.device_telemetry
order by device_id, recorded_at desc;

-- RLS
alter table public.device_inventory enable row level security;
alter table public.devices enable row level security;
alter table public.device_api_keys enable row level security;
alter table public.device_registrations enable row level security;
alter table public.device_telemetry enable row level security;

-- Inventory policies (staff only)
create policy "Staff can manage inventory"
  on public.device_inventory
  for all
  using (public.is_staff())
  with check (public.is_staff());

-- Devices policies
create policy "Staff can access all devices"
  on public.devices
  for select
  using (public.is_staff());

create policy "Owners can access their devices"
  on public.devices
  for select
  using (auth.uid() = customer_id);

create policy "Staff can manage devices"
  on public.devices
  for all
  using (public.is_staff())
  with check (public.is_staff());

create policy "Owners can update their devices"
  on public.devices
  for update
  using (auth.uid() = customer_id);

-- API keys policies (staff only)
create policy "Staff can manage device API keys"
  on public.device_api_keys
  for all
  using (public.is_staff())
  with check (public.is_staff());

-- Registration policies
create policy "Users can request registration"
  on public.device_registrations
  for insert
  with check (auth.uid() = requested_by);

create policy "Users can view their registration"
  on public.device_registrations
  for select
  using (auth.uid() = requested_by);

create policy "Staff can manage registrations"
  on public.device_registrations
  for all
  using (public.is_staff())
  with check (public.is_staff());

-- Telemetry policies (read only)
create policy "Staff can view telemetry"
  on public.device_telemetry
  for select
  using (public.is_staff());

create policy "Owners can view telemetry"
  on public.device_telemetry
  for select
  using (
    exists (
      select 1
      from public.devices
      where devices.id = device_telemetry.device_id
        and devices.customer_id = auth.uid()
    )
  );

create policy "No direct telemetry inserts"
  on public.device_telemetry
  for insert
  with check (false);

-- Functions
create or replace function public.create_device_api_key(p_device_id uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  api_key text;
  api_key_hash text;
begin
  api_key := encode(gen_random_bytes(32), 'hex');
  api_key_hash := encode(digest(api_key, 'sha256'), 'hex');

  insert into public.device_api_keys (device_id, key_hash)
  values (p_device_id, api_key_hash);

  return api_key;
end;
$$;

create or replace function public.approve_device_registration(p_registration_id uuid)
returns text
language plpgsql
security definer
set search_path = public
as $$
declare
  reg record;
  inv record;
  device_id uuid;
  api_key text;
begin
  select * into reg
  from public.device_registrations
  where id = p_registration_id
  for update;

  if reg is null then
    raise exception 'Registration not found';
  end if;

  if reg.status <> 'pending' then
    raise exception 'Registration already processed';
  end if;

  select * into inv
  from public.device_inventory
  where serial_number = reg.serial_number;

  if inv is null then
    raise exception 'Device not provisioned in inventory';
  end if;

  if reg.metadata ? 'qr_code' and reg.metadata->>'qr_code' <> '' then
    if inv.qr_code is null or inv.qr_code <> reg.metadata->>'qr_code' then
      raise exception 'QR code does not match inventory record';
    end if;
  end if;

  insert into public.devices (
    inventory_id,
    serial_number,
    mac_address,
    qr_code,
    device_type,
    location,
    installation_date,
    customer_id,
    assigned_by,
    status
  ) values (
    inv.id,
    inv.serial_number,
    inv.mac_address,
    inv.qr_code,
    inv.device_type,
    coalesce(reg.metadata->>'location', ''),
    (nullif(reg.metadata->>'installation_date', ''))::date,
    reg.requested_by,
    auth.uid(),
    'active'
  )
  returning id into device_id;

  update public.device_inventory
  set status = 'provisioned'
  where id = inv.id;

  api_key := public.create_device_api_key(device_id);

  update public.device_registrations
  set status = 'approved',
      reviewed_by = auth.uid(),
      reviewed_at = now()
  where id = reg.id;

  return api_key;
end;
$$;

create or replace function public.reject_device_registration(
  p_registration_id uuid,
  p_reason text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.device_registrations
  set status = 'rejected',
      reviewed_by = auth.uid(),
      reviewed_at = now(),
      metadata = coalesce(metadata, '{}'::jsonb) || jsonb_build_object('rejection_reason', p_reason)
  where id = p_registration_id;
end;
$$;

create or replace function public.ingest_device_telemetry(
  p_api_key text,
  p_payload jsonb
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  api_key_hash text;
  device_id uuid;
  recorded_at timestamptz;
  status_value text;
begin
  api_key_hash := encode(digest(p_api_key, 'sha256'), 'hex');

  select device_api_keys.device_id
  into device_id
  from public.device_api_keys
  where device_api_keys.key_hash = api_key_hash
    and revoked_at is null
  limit 1;

  if device_id is null then
    raise exception 'Invalid API key';
  end if;

  recorded_at := coalesce((p_payload->>'recorded_at')::timestamptz, now());
  status_value := p_payload->>'status';

  insert into public.device_telemetry (
    device_id,
    recorded_at,
    voltage,
    current,
    power_output,
    energy_generated,
    battery_level,
    temperature,
    fault_code,
    status,
    raw
  ) values (
    device_id,
    recorded_at,
    (p_payload->>'voltage')::numeric,
    (p_payload->>'current')::numeric,
    (p_payload->>'power_output')::numeric,
    (p_payload->>'energy_generated')::numeric,
    (p_payload->>'battery_level')::numeric,
    (p_payload->>'temperature')::numeric,
    p_payload->>'fault_code',
    status_value,
    p_payload
  );

  update public.devices
  set last_seen_at = recorded_at,
      status = coalesce(status_value, status),
      updated_at = now()
  where id = device_id;
end;
$$;
