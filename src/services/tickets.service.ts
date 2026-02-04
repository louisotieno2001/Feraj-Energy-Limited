import { supabase } from '@/lib/supabase';

export interface Ticket {
  id: string;
  created_by: string;
  assigned_to: string | null;
  status: 'open' | 'in_progress' | 'resolved';
  subject: string;
  message: string;
  response: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateTicketDto {
  subject: string;
  message: string;
}

export interface UpdateTicketDto {
  status?: 'open' | 'in_progress' | 'resolved';
  assigned_to?: string | null;
  response?: string | null;
}

export async function getTickets(limit = 100) {
  const { data, error } = await supabase
    .from('tickets')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data as Ticket[];
}

export async function createTicket(payload: CreateTicketDto, userId: string) {
  const { data, error } = await supabase
    .from('tickets')
    .insert({
      created_by: userId,
      status: 'open',
      subject: payload.subject,
      message: payload.message,
    })
    .select()
    .single();

  if (error) throw error;
  return data as Ticket;
}

export async function updateTicket(ticketId: string, updates: UpdateTicketDto) {
  const { data, error } = await supabase
    .from('tickets')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', ticketId)
    .select()
    .single();

  if (error) throw error;
  return data as Ticket;
}
