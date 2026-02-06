import { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle,
  ClipboardCopy,
  Cloud,
  FileUp,
  Power,
  XCircle,
} from 'lucide-react';
import {
  approveDeviceRegistration,
  bulkProvisionInventory,
  getAllDevices,
  getDeviceRegistrations,
  rejectDeviceRegistration,
  updateDevice,
  type Device,
  type DeviceRegistration,
} from '@/services/device.service';
import { toast } from 'sonner';

export function AdminDevices() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [registrations, setRegistrations] = useState<DeviceRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [issuingKey, setIssuingKey] = useState<string | null>(null);
  const [bulkLoading, setBulkLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [devicesData, registrationsData] = await Promise.all([
          getAllDevices(),
          getDeviceRegistrations(),
        ]);
        setDevices(devicesData);
        setRegistrations(registrationsData);
      } catch (error: any) {
        toast.error(error.message || 'Failed to load devices');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const pendingRegistrations = useMemo(
    () => registrations.filter((reg) => reg.status === 'pending'),
    [registrations]
  );

  const handleApprove = async (id: string) => {
    try {
      const apiKey = await approveDeviceRegistration(id);
      setIssuingKey(apiKey);
      toast.success('Device approved');
      const updated = await getDeviceRegistrations();
      const updatedDevices = await getAllDevices();
      setRegistrations(updated);
      setDevices(updatedDevices);
    } catch (error: any) {
      toast.error(error.message || 'Failed to approve');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectDeviceRegistration(id, 'Rejected by admin');
      toast.success('Registration rejected');
      setRegistrations(await getDeviceRegistrations());
    } catch (error: any) {
      toast.error(error.message || 'Failed to reject');
    }
  };

  const handleStatusToggle = async (device: Device) => {
    const nextStatus = device.status === 'active' ? 'inactive' : 'active';
    try {
      const updated = await updateDevice(device.id, { status: nextStatus });
      setDevices((prev) =>
        prev.map((item) => (item.id === device.id ? updated : item))
      );
    } catch (error: any) {
      toast.error(error.message || 'Failed to update device');
    }
  };

  const handleBulkUpload = async (file: File | null) => {
    if (!file) return;
    try {
      setBulkLoading(true);
      const text = await file.text();
      const rows = text
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);

      const header = rows[0].toLowerCase();
      const hasHeader = header.includes('serial_number');
      const dataRows = hasHeader ? rows.slice(1) : rows;

      const payload = dataRows.map((line) => {
        const [serial_number, mac_address, qr_code, device_type] = line
          .split(',')
          .map((value) => value.trim());

        return {
          serial_number,
          mac_address: mac_address || undefined,
          qr_code: qr_code || undefined,
          device_type,
        };
      });

      await bulkProvisionInventory(payload);
      toast.success('Inventory updated');
    } catch (error: any) {
      toast.error(error.message || 'Bulk upload failed');
    } finally {
      setBulkLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-6 w-40 bg-secondary/60 rounded animate-pulse" />
        <div className="h-32 bg-secondary/60 rounded animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Pending Registrations
          </h2>
          {pendingRegistrations.length === 0 ? (
            <p className="text-muted-foreground">
              No pending registrations right now.
            </p>
          ) : (
            <div className="space-y-4">
              {pendingRegistrations.map((reg) => (
                <div
                  key={reg.id}
                  className="border border-border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div>
                    <p className="text-sm text-muted-foreground">Serial</p>
                    <p className="text-lg font-semibold text-foreground">
                      {reg.serial_number}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Method: {reg.method}
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleApprove(reg.id)}
                      className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition text-sm"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(reg.id)}
                      className="px-4 py-2 rounded-md btn-secondary text-sm"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="w-full lg:w-80 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            Bulk Provision
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Upload CSV with columns: serial_number, mac_address, qr_code,
            device_type
          </p>
          <label className="flex items-center gap-2 px-4 py-2 border border-border rounded-md cursor-pointer hover:bg-secondary/70 transition text-sm">
            <FileUp className="h-4 w-4" />
            <span>{bulkLoading ? 'Uploading...' : 'Upload CSV'}</span>
            <input
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => handleBulkUpload(e.target.files?.[0] || null)}
              disabled={bulkLoading}
            />
          </label>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">
            Registered Devices
          </h2>
          <span className="text-sm text-muted-foreground">
            {devices.length} devices
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-background/90">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">
                  Serial
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">
                  Type
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-2 text-left text-xs font-semibold text-muted-foreground">
                  Last Seen
                </th>
                <th className="px-4 py-2 text-right text-xs font-semibold text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {devices.map((device) => (
                <tr key={device.id} className="hover:bg-secondary/70">
                  <td className="px-4 py-3 text-sm text-foreground">
                    {device.serial_number}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground/80">
                    {device.device_type}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                        device.status === 'active'
                          ? 'bg-secondary text-primary'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      <Cloud className="h-3 w-3" />
                      {device.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {device.last_seen_at
                      ? new Date(device.last_seen_at).toLocaleString()
                      : '—'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleStatusToggle(device)}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-md btn-secondary text-xs"
                    >
                      <Power className="h-4 w-4" />
                      {device.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {issuingKey && (
        <div className="bg-white rounded-lg shadow-md p-6 border border-primary/20">
          <div className="flex items-center gap-2 text-primary mb-3">
            <CheckCircle className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Device API Key Issued</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Copy and store this key now. It won&apos;t be shown again.
          </p>
          <div className="flex items-center gap-3">
            <code className="px-4 py-2 rounded-md bg-background/90 text-sm break-all">
              {issuingKey}
            </code>
            <button
              onClick={() => {
                navigator.clipboard.writeText(issuingKey);
                toast.success('API key copied');
              }}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md btn-secondary text-xs"
            >
              <ClipboardCopy className="h-4 w-4" />
              Copy
            </button>
            <button
              onClick={() => setIssuingKey(null)}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-md btn-secondary text-xs"
            >
              <XCircle className="h-4 w-4" />
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
