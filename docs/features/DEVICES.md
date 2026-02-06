# Energy Device Module

This module adds device registration, monitoring, and admin management using Supabase.

## Setup
1. Run `docs/deployment/DEVICE_MODULE_SETUP.sql` in Supabase SQL editor.
2. Ensure Realtime is enabled for `device_telemetry`.
3. Confirm the following tables exist:
   - `device_inventory`, `devices`, `device_api_keys`, `device_registrations`, `device_telemetry`

## Registration Flow
1. Customer submits serial number (and optional QR code) on `/devices`.
2. Admin approves registration in `/admin/devices`.
3. Approval issues a one-time API key for device connectivity.

## Telemetry Ingest
Devices should call the Supabase RPC:
```
rpc("ingest_device_telemetry", { p_api_key, p_payload })
```
`p_payload` should include metrics like `voltage`, `current`, `power_output`, `energy_generated`, `battery_level`, `temperature`, and `status`.

## Dashboard
User dashboard is available at `/devices`. Admin management lives in `/admin/devices`.
