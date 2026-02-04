import { supabase } from '@/lib/supabase';

export interface AuditLog {
  id: string;
  actor_user_id: string | null;
  target_user_id: string | null;
  action: string;
  metadata: Record<string, any> | null;
  created_at: string;
}

export interface CreateAuditLog {
  actor_user_id?: string | null;
  target_user_id?: string | null;
  action: string;
  metadata?: Record<string, any> | null;
}

export async function createAuditLog(payload: CreateAuditLog) {
  const { data, error } = await supabase
    .from('audit_logs')
    .insert({
      actor_user_id: payload.actor_user_id ?? null,
      target_user_id: payload.target_user_id ?? null,
      action: payload.action,
      metadata: payload.metadata ?? null,
    })
    .select()
    .single();

  if (error) throw error;
  return data as AuditLog;
}

export async function getAuditLogs(limit = 100) {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as AuditLog[];
}
