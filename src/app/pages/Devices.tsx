import { useEffect, useMemo, useState } from 'react';
import {
  Activity,
  Battery,
  Bolt,
  Calendar,
  MapPin,
  Thermometer,
  AlertTriangle,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import {
  getLatestTelemetry,
  getMyDevices,
  requestDeviceRegistration,
  updateDevice,
  type Device,
  type TelemetryPoint,
} from '@/services/device.service';
import { toast } from 'sonner';

export function Devices() {
  const { user } = useAuth();
  const [devices, setDevices] = useState<Device[]>([]);
  const [telemetry, setTelemetry] = useState<Record<string, TelemetryPoint>>(
    {}
  );
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    serial_number: '',
    qr_code: '',
    location: '',
    installation_date: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [locationDraft, setLocationDraft] = useState('');

  useEffect(() => {
    const fetchDevices = async () => {
      if (!user) return;
      try {
        setLoading(true);
        const data = await getMyDevices(user.id);
        setDevices(data);
      } catch (error: any) {
        toast.error(error.message || 'Failed to load devices');
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, [user]);

  useEffect(() => {
    const fetchTelemetry = async () => {
      const ids = devices.map((device) => device.id);
      if (!ids.length) return;
      try {
        const latest = await getLatestTelemetry(ids);
        const map = latest.reduce<Record<string, TelemetryPoint>>(
          (acc, point) => {
            acc[point.device_id] = point;
            return acc;
          },
          {}
        );
        setTelemetry(map);
      } catch (error: any) {
        console.error('Telemetry fetch failed', error);
      }
    };

    fetchTelemetry();
  }, [devices]);

  useEffect(() => {
    if (!devices.length) return;
    const channel = supabase
      .channel('device-telemetry-stream')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'device_telemetry' },
        (payload) => {
          const point = payload.new as TelemetryPoint;
          if (!devices.find((device) => device.id === point.device_id)) {
            return;
          }
          setTelemetry((prev) => ({
            ...prev,
            [point.device_id]: point,
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [devices]);

  const metrics = useMemo(() => {
    if (!devices.length) return null;
    const totals = devices.reduce(
      (acc, device) => {
        const point = telemetry[device.id];
        if (!point) return acc;
        acc.power_output += point.power_output || 0;
        acc.energy_generated += point.energy_generated || 0;
        acc.faults += point.fault_code ? 1 : 0;
        return acc;
      },
      { power_output: 0, energy_generated: 0, faults: 0 }
    );

    return totals;
  }, [devices, telemetry]);

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;

    try {
      setSubmitting(true);
      await requestDeviceRegistration({
        serial_number: form.serial_number.trim(),
        method: 'self',
        requested_by: user.id,
        metadata: {
          qr_code: form.qr_code.trim(),
          location: form.location.trim(),
          installation_date: form.installation_date || null,
        },
      });
      toast.success('Device registration submitted for approval.');
      setForm({
        serial_number: '',
        qr_code: '',
        location: '',
        installation_date: '',
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to register device');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLocationSave = async (device: Device) => {
    try {
      await updateDevice(device.id, { location: locationDraft });
      setDevices((prev) =>
        prev.map((item) =>
          item.id === device.id ? { ...item, location: locationDraft } : item
        )
      );
      setEditingId(null);
      toast.success('Device updated');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update device');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background/90 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="h-8 w-56 bg-secondary/60 rounded animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow-md p-6 animate-pulse space-y-4"
              >
                <div className="h-5 w-32 bg-secondary/60 rounded" />
                <div className="h-4 w-44 bg-secondary/60 rounded" />
                <div className="h-12 w-full bg-secondary/60 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background/90 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Devices</h1>
          <p className="text-muted-foreground mt-2">
            Monitor live energy output, device health, and installation details.
          </p>
        </div>

        {metrics && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3 text-foreground/80 mb-2">
                <Bolt className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Live Output</span>
              </div>
              <div className="text-2xl font-bold text-foreground">
                {metrics.power_output.toFixed(1)} kW
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3 text-foreground/80 mb-2">
                <Activity className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Energy Generated</span>
              </div>
              <div className="text-2xl font-bold text-foreground">
                {metrics.energy_generated.toFixed(1)} kWh
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center gap-3 text-foreground/80 mb-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Active Alerts</span>
              </div>
              <div className="text-2xl font-bold text-foreground">
                {metrics.faults}
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {devices.length === 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  No registered devices yet
                </h2>
                <p className="text-muted-foreground">
                  Register your device to start monitoring energy production.
                </p>
              </div>
            )}

            {devices.map((device) => {
              const point = telemetry[device.id];
              const status = point?.status || device.status;
              const alert =
                point?.fault_code ||
                (status && status !== 'active' && status !== 'online');

              return (
                <div
                  key={device.id}
                  className="bg-white rounded-lg shadow-md p-6 space-y-4"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">
                        {device.device_type} • {device.serial_number}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Last seen{' '}
                        {device.last_seen_at
                          ? new Date(device.last_seen_at).toLocaleString()
                          : '—'}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                        alert
                          ? 'bg-red-100 text-red-700'
                          : 'bg-secondary text-primary'
                      }`}
                    >
                      {alert ? 'Attention Required' : 'Healthy'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-background/90 rounded-lg p-4">
                      <p className="text-xs text-muted-foreground">Power</p>
                      <p className="text-lg font-semibold text-foreground">
                        {point?.power_output?.toFixed(1) || '—'} kW
                      </p>
                    </div>
                    <div className="bg-background/90 rounded-lg p-4">
                      <p className="text-xs text-muted-foreground">Voltage</p>
                      <p className="text-lg font-semibold text-foreground">
                        {point?.voltage?.toFixed(1) || '—'} V
                      </p>
                    </div>
                    <div className="bg-background/90 rounded-lg p-4">
                      <p className="text-xs text-muted-foreground">Battery</p>
                      <p className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <Battery className="h-4 w-4 text-primary" />
                        {point?.battery_level?.toFixed(0) || '—'}%
                      </p>
                    </div>
                    <div className="bg-background/90 rounded-lg p-4">
                      <p className="text-xs text-muted-foreground">
                        Temperature
                      </p>
                      <p className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <Thermometer className="h-4 w-4 text-primary" />
                        {point?.temperature?.toFixed(1) || '—'}°C
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      {device.location || 'No location set'}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      {device.installation_date || 'No installation date'}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    {editingId === device.id ? (
                      <div className="flex flex-col md:flex-row gap-3">
                        <input
                          value={locationDraft}
                          onChange={(e) => setLocationDraft(e.target.value)}
                          className="flex-1 px-4 py-2 border border-border rounded-md bg-white"
                          placeholder="Update device location"
                        />
                        <button
                          type="button"
                          onClick={() => handleLocationSave(device)}
                          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="px-4 py-2 rounded-md btn-secondary"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingId(device.id);
                          setLocationDraft(device.location || '');
                        }}
                        className="text-sm font-semibold text-primary hover:text-primary/80 transition"
                      >
                        Update device info
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 h-fit">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Register a Device
            </h2>
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">
                  Serial Number
                </label>
                <input
                  value={form.serial_number}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      serial_number: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border border-border rounded-md bg-white"
                  placeholder="SN-0001-XYZ"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">
                  QR Code (Optional)
                </label>
                <input
                  value={form.qr_code}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      qr_code: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border border-border rounded-md bg-white"
                  placeholder="QR-001-ABC"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">
                  Installation Location
                </label>
                <input
                  value={form.location}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border border-border rounded-md bg-white"
                  placeholder="Nairobi, Kenya"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">
                  Installation Date
                </label>
                <input
                  type="date"
                  value={form.installation_date}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      installation_date: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 border border-border rounded-md bg-white"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Registration'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
