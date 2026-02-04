import { supabase } from '@/lib/supabase';

export interface UserPermissions {
  user_id: string;
  can_manage_products: boolean;
  can_manage_tickets: boolean;
  can_promote_to_co_admin: boolean;
  created_at: string;
  updated_at: string;
}

export interface UpdateUserPermissions {
  can_manage_products?: boolean;
  can_manage_tickets?: boolean;
  can_promote_to_co_admin?: boolean;
}

export async function getUserPermissions(userId: string) {
  const { data, error } = await supabase
    .from('user_permissions')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data as UserPermissions;
}

export async function upsertUserPermissions(
  userId: string,
  updates: UpdateUserPermissions
) {
  const payload = {
    user_id: userId,
    ...updates,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('user_permissions')
    .upsert(payload, { onConflict: 'user_id' })
    .select()
    .single();

  if (error) throw error;
  return data as UserPermissions;
}
