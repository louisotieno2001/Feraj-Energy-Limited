-- Performance indexes for product/device fetch paths
-- Run in Supabase SQL editor during low-traffic window.

create index if not exists products_active_created_at_idx
  on public.products (is_active, created_at desc);

create index if not exists devices_customer_created_at_idx
  on public.devices (customer_id, created_at desc);

create index if not exists device_telemetry_device_recorded_at_idx
  on public.device_telemetry (device_id, recorded_at desc);

-- Optional search acceleration (enable only if product search proves slow)
create extension if not exists pg_trgm;

create index if not exists products_name_trgm_idx
  on public.products using gin (name gin_trgm_ops);

create index if not exists products_description_trgm_idx
  on public.products using gin (description gin_trgm_ops);
