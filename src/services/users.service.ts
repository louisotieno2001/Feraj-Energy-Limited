import { supabase } from '@/lib/supabase';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  role: 'customer' | 'employee' | 'co_admin' | 'admin';
  phone: string | null;
  company_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserStats {
  totalUsers: number;
  totalAdmins: number;
  totalCustomers: number;
  totalEmployees: number;
  totalCoAdmins: number;
  recentUsers: Profile[];
}

function normalizeRoleInput(
  role: string
): 'customer' | 'employee' | 'co_admin' | 'admin' {
  const normalized = role.trim().toLowerCase().replace(/-/g, '_');

  if (normalized === 'coadmin') {
    return 'co_admin';
  }

  if (normalized === 'installer') {
    return 'employee';
  }

  if (
    normalized === 'customer' ||
    normalized === 'employee' ||
    normalized === 'co_admin' ||
    normalized === 'admin'
  ) {
    return normalized;
  }

  throw new Error(`Invalid role value: ${role}`);
}

/**
 * Fetch all users - Admin only
 */
export async function getAllUsers() {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Profile[];
}

/**
 * Get user by ID
 */
export async function getUserById(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data as Profile;
}

/**
 * Update user role - Admin only
 */
export async function updateUserRole(
  userId: string,
  newRole: 'customer' | 'employee' | 'co_admin' | 'admin'
) {
  const normalizedRole = normalizeRoleInput(newRole);

  const { data, error } = await supabase
    .from('profiles')
    .update({
      role: normalizedRole,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    const isRoleConstraintError =
      error.code === '23514' ||
      error.message?.includes('profiles_role_check') ||
      error.message?.includes('violates check constraint');

    if (isRoleConstraintError) {
      throw new Error(
        `Role update to "${normalizedRole}" was blocked by Supabase constraint. Run docs/deployment/FIX_PROFILES_ROLE_CONSTRAINT.sql in Supabase SQL Editor.`
      );
    }
    throw error;
  }
  return data as Profile;
}

/**
 * Search users by name or email
 */
export async function searchUsers(query: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .or(`full_name.ilike.%${query}%,email.ilike.%${query}%`)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Profile[];
}

/**
 * Get users by role
 */
export async function getUsersByRole(
  role: 'customer' | 'employee' | 'co_admin' | 'admin'
) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('role', role)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Profile[];
}

/**
 * Get user statistics - Admin only
 */
export async function getUserStats(): Promise<UserStats> {
  // Get all users
  const { data: allUsers, error: allError } = await supabase
    .from('profiles')
    .select('*');

  if (allError) throw allError;

  // Get recent users (last 5)
  const { data: recentUsers, error: recentError } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  if (recentError) throw recentError;

  // Calculate stats
  const totalUsers = allUsers.length;
  const totalAdmins = allUsers.filter((u) => u.role === 'admin').length;
  const totalCustomers = allUsers.filter((u) => u.role === 'customer').length;
  const totalEmployees = allUsers.filter((u) => u.role === 'employee').length;
  const totalCoAdmins = allUsers.filter((u) => u.role === 'co_admin').length;

  return {
    totalUsers,
    totalAdmins,
    totalCustomers,
    totalEmployees,
    totalCoAdmins,
    recentUsers: recentUsers as Profile[],
  };
}

/**
 * Update user profile - Admin can update any user
 */
export async function updateUserProfile(
  userId: string,
  updates: Partial<Omit<Profile, 'id' | 'email' | 'created_at'>>
) {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data as Profile;
}

/**
 * Delete user (soft delete by setting role to inactive) - Use with caution
 * Note: This doesn't actually delete the user, just changes their role
 * For actual deletion, use Supabase dashboard
 */
export async function deactivateUser(userId: string) {
  const { error } = await supabase
    .from('profiles')
    .update({
      role: 'customer', // Demote to customer
      updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) throw error;
}
