import { supabase } from '@/lib/supabase';

const DEVICE_COLUMNS =
  'id,serial_number,mac_address,qr_code,device_type,location,installation_date,customer_id,status,last_seen_at,created_at,updated_at';

const TELEMETRY_COLUMNS =
  'device_id,recorded_at,voltage,current,power_output,energy_generated,battery_level,temperature,fault_code,status,raw';

export interface Device {
  id: string;
  serial_number: string;
  mac_address: string | null;
  qr_code: string | null;
  device_type: string;
  location: string | null;
  installation_date: string | null;
  customer_id: string | null;
  status: string;
  last_seen_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DeviceRegistration {
  id: string;
  serial_number: string;
  method: string;
  requested_by: string | null;
  status: string;
  metadata: Record<string, any> | null;
  bulk_batch_id: string | null;
  reviewed_by: string | null;
  reviewed_at: string | null;
  created_at: string;
}

export interface TelemetryPoint {
  device_id: string;
  recorded_at: string;
  voltage: number | null;
  current: number | null;
  power_output: number | null;
  energy_generated: number | null;
  battery_level: number | null;
  temperature: number | null;
  fault_code: string | null;
  status: string | null;
  raw: Record<string, any> | null;
}

export async function getMyDevices(userId: string) {
  const { data, error } = await supabase
    .from('devices')
    .select(DEVICE_COLUMNS)
    .eq('customer_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Device[];
}

export async function getAllDevices() {
  const { data, error } = await supabase
    .from('devices')
    .select(DEVICE_COLUMNS)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Device[];
}

export async function updateDevice(id: string, updates: Partial<Device>) {
  const { data, error } = await supabase
    .from('devices')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Device;
}

export async function requestDeviceRegistration(input: {
  serial_number: string;
  method: 'installer' | 'self' | 'bulk';
  requested_by: string;
  metadata?: Record<string, any>;
}) {
  const { data, error } = await supabase
    .from('device_registrations')
    .insert([
      {
        serial_number: input.serial_number,
        method: input.method,
        requested_by: input.requested_by,
        metadata: input.metadata ?? null,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data as DeviceRegistration;
}

export async function getDeviceRegistrations() {
  const { data, error } = await supabase
    .from('device_registrations')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as DeviceRegistration[];
}

export async function approveDeviceRegistration(registrationId: string) {
  const { data, error } = await supabase.rpc('approve_device_registration', {
    p_registration_id: registrationId,
  });

  if (error) throw error;
  return data as string;
}

export async function rejectDeviceRegistration(
  registrationId: string,
  reason: string
) {
  const { error } = await supabase.rpc('reject_device_registration', {
    p_registration_id: registrationId,
    p_reason: reason,
  });

  if (error) throw error;
}

export async function getLatestTelemetry(deviceIds: string[]) {
  if (deviceIds.length === 0) return [];
  const { data, error } = await supabase
    .from('device_latest_telemetry')
    .select(TELEMETRY_COLUMNS)
    .in('device_id', deviceIds);

  if (error) throw error;
  return data as TelemetryPoint[];
}

export async function getTelemetryRange(
  deviceId: string,
  start: string,
  end: string
) {
  const { data, error } = await supabase
    .from('device_telemetry')
    .select(TELEMETRY_COLUMNS)
    .eq('device_id', deviceId)
    .gte('recorded_at', start)
    .lte('recorded_at', end)
    .order('recorded_at', { ascending: true });

  if (error) throw error;
  return data as TelemetryPoint[];
}

export async function bulkProvisionInventory(
  payload: Array<{
    serial_number: string;
    mac_address?: string;
    qr_code?: string;
    device_type: string;
    device_key_hash?: string;
    metadata?: Record<string, any>;
  }>
) {
  const { data, error } = await supabase
    .from('device_inventory')
    .insert(payload)
    .select();

  if (error) throw error;
  return data;
}
