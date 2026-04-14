import { useEffect, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  MessageSquare,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  createAuditLog,
  getAuditLogs,
  type AuditLog,
} from '@/services/audit.service';
import {
  getTickets,
  updateTicket,
  type Ticket,
} from '@/services/tickets.service';
import { toast } from 'sonner';

export function AdminAudit() {
  const { user, profile, permissions } = useAuth();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingTicketId, setUpdatingTicketId] = useState<string | null>(null);
  const [responses, setResponses] = useState<Record<string, string>>({});

  const canManageTickets =
    profile?.role === 'admin' ||
    profile?.role === 'co_admin' ||
    (profile?.role === 'employee' && permissions?.can_manage_tickets);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [auditLogs, ticketData] = await Promise.all([
          getAuditLogs(200),
          getTickets(200),
        ]);
        setLogs(auditLogs);
        setTickets(ticketData);
      } catch (error: any) {
        console.error('Error loading audit data:', error);
        toast.error('Failed to load audit data');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleResolveTicket = async (ticket: Ticket) => {
    if (!canManageTickets) {
      toast.error('You do not have permission to resolve tickets');
      return;
    }

    try {
      setUpdatingTicketId(ticket.id);
      const updated = await updateTicket(ticket.id, {
        status: 'resolved',
        response: responses[ticket.id] || ticket.response,
      });
      setTickets((prev) => prev.map((t) => (t.id === ticket.id ? updated : t)));

      if (user?.id) {
        await createAuditLog({
          actor_user_id: user.id,
          target_user_id: ticket.created_by,
          action: 'ticket.resolve',
          metadata: { ticket_id: ticket.id, subject: ticket.subject },
        });
      }

      toast.success('Ticket resolved');
    } catch (error: any) {
      console.error('Error resolving ticket:', error);
      toast.error('Failed to resolve ticket');
    } finally {
      setUpdatingTicketId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-white/86">
      <div>
        <p className="cinematic-eyebrow">Monitoring</p>
        <h1 className="mt-2 text-3xl font-semibold text-white/92">
          Audit & Monitoring
        </h1>
        <p className="mt-2 text-sm text-white/60">
          Activity feed and ticket queue for staff oversight.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="cinematic-panel overflow-hidden">
          <div className="border-b border-white/8 px-6 py-4 bg-white/4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-white/72">
              Activity Feed
            </h2>
          </div>
          <div className="divide-y divide-white/8">
            {logs.length === 0 && (
              <div className="p-6 text-center text-white/55">
                <AlertCircle className="mx-auto mb-2 h-10 w-10 text-white/25" />
                No audit entries yet.
              </div>
            )}
            {logs.map((log) => (
              <div key={log.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium text-white/90">
                    {log.action}
                  </div>
                  <div className="text-xs text-white/48">
                    {new Date(log.created_at).toLocaleString()}
                  </div>
                </div>
                {log.metadata && (
                  <pre className="mt-2 overflow-x-auto rounded bg-white/5 p-2 text-xs text-white/55">
                    {JSON.stringify(log.metadata, null, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="cinematic-panel overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/8 px-6 py-4 bg-white/4">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-white/72">
              Tickets
            </h2>
            <span className="text-xs text-white/48">
              {tickets.filter((t) => t.status !== 'resolved').length} open
            </span>
          </div>
          <div className="divide-y divide-white/8">
            {tickets.length === 0 && (
              <div className="p-6 text-center text-white/55">
                <MessageSquare className="mx-auto mb-2 h-10 w-10 text-white/25" />
                No tickets yet.
              </div>
            )}
            {tickets.map((ticket) => (
              <div key={ticket.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-white/90">
                      {ticket.subject}
                    </p>
                    <p className="text-xs text-white/48">
                      {new Date(ticket.created_at).toLocaleString()}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/6 px-2 py-1 text-xs font-medium text-white/72">
                    {ticket.status === 'resolved' ? (
                      <CheckCircle2 className="h-3 w-3 text-primary" />
                    ) : (
                      <Clock className="h-3 w-3 text-orange-500" />
                    )}
                    {ticket.status}
                  </span>
                </div>
                <p className="text-sm text-white/76">{ticket.message}</p>
                <div>
                  <label className="mb-1 block text-xs text-white/48">
                    Response
                  </label>
                  <textarea
                    className="w-full rounded-md border border-white/10 bg-white/5 p-2 text-sm text-white/86 placeholder:text-white/36"
                    rows={2}
                    value={responses[ticket.id] ?? ticket.response ?? ''}
                    onChange={(e) =>
                      setResponses((prev) => ({
                        ...prev,
                        [ticket.id]: e.target.value,
                      }))
                    }
                    disabled={!canManageTickets}
                    placeholder={
                      canManageTickets
                        ? 'Write a response for the customer...'
                        : 'You have read-only access to tickets.'
                    }
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => handleResolveTicket(ticket)}
                    disabled={
                      !canManageTickets || updatingTicketId === ticket.id
                    }
                    className="rounded-md bg-primary px-3 py-2 text-xs font-medium text-white hover:bg-primary/90 disabled:opacity-50"
                  >
                    {updatingTicketId === ticket.id
                      ? 'Saving...'
                      : 'Resolve Ticket'}
                  </button>
                </div>
              </div>
            ))}
          </div>
          {!canManageTickets && (
            <div className="border-t border-white/8 px-6 py-3 text-xs text-white/48">
              You can view tickets, but you need permission to respond or
              resolve them.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
