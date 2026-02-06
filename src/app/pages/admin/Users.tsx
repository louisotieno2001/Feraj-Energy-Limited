import { useState, useEffect } from 'react';
import {
  getAllUsers,
  updateUserRole,
  type Profile,
} from '@/services/users.service';
import {
  getUserPermissions,
  upsertUserPermissions,
  type UserPermissions,
} from '@/services/permissions.service';
import { createAuditLog } from '@/services/audit.service';
import { Loader2, Search, Shield, User, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export function AdminUsers() {
  const { user: currentUser, profile: currentProfile } = useAuth();
  const [users, setUsers] = useState<Profile[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<
    'all' | 'customer' | 'employee' | 'co_admin' | 'admin'
  >('all');
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [selectedPermissions, setSelectedPermissions] =
    useState<UserPermissions | null>(null);
  const [selectedRole, setSelectedRole] = useState<Profile['role'] | null>(
    null
  );
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [loadingPermissions, setLoadingPermissions] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchQuery, roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (user) =>
          user.email.toLowerCase().includes(query) ||
          user.full_name?.toLowerCase().includes(query)
      );
    }

    // Apply role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    setFilteredUsers(filtered);
  };

  const isAdmin = currentProfile?.role === 'admin';
  const isCoAdmin = currentProfile?.role === 'co_admin';

  const canManageUsers = !!(isAdmin || isCoAdmin);

  const loadPermissionsForUser = async (userId: string) => {
    try {
      setLoadingPermissions(true);
      const perms = await getUserPermissions(userId);
      setSelectedPermissions(perms);
    } catch {
      // If no permissions row exists, default to null and let upsert create
      setSelectedPermissions(null);
    } finally {
      setLoadingPermissions(false);
    }
  };

  const applyUserChanges = async () => {
    if (!selectedUser || !selectedRole) return;

    // Prevent user from demoting themselves
    if (selectedUser.id === currentUser?.id && selectedRole !== 'admin') {
      toast.error('You cannot change your own admin role');
      return;
    }

    try {
      setUpdating(true);

      if (selectedRole !== selectedUser.role) {
        await updateUserRole(selectedUser.id, selectedRole);

        setUsers((prev) =>
          prev.map((u) =>
            u.id === selectedUser.id ? { ...u, role: selectedRole } : u
          )
        );

        if (currentUser?.id) {
          await createAuditLog({
            actor_user_id: currentUser.id,
            target_user_id: selectedUser.id,
            action: 'role.change',
            metadata: { role: selectedRole },
          });
        }
      }

      if (selectedPermissions) {
        const updated = await upsertUserPermissions(selectedUser.id, {
          can_manage_products: selectedPermissions.can_manage_products,
          can_manage_tickets: selectedPermissions.can_manage_tickets,
          can_promote_to_co_admin: selectedPermissions.can_promote_to_co_admin,
        });
        setSelectedPermissions(updated);

        if (currentUser?.id) {
          await createAuditLog({
            actor_user_id: currentUser.id,
            target_user_id: selectedUser.id,
            action: 'permissions.update',
            metadata: {
              can_manage_products: updated.can_manage_products,
              can_manage_tickets: updated.can_manage_tickets,
              can_promote_to_co_admin: updated.can_promote_to_co_admin,
            },
          });
        }
      }

      toast.success('User updated');
      setShowRoleModal(false);
      setSelectedUser(null);
      setSelectedRole(null);
      setSelectedPermissions(null);
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    } finally {
      setUpdating(false);
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4" />;
      case 'co_admin':
        return <Shield className="h-4 w-4" />;
      case 'employee':
        return <User className="h-4 w-4" />;
      default:
        return <User className="h-4 w-4" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'co_admin':
        return 'bg-indigo-100 text-indigo-800';
      case 'employee':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-secondary text-primary';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!canManageUsers) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">
          User Management
        </h1>
        <p className="text-muted-foreground">
          You do not have permission to manage users. Contact an admin to
          request access.
        </p>
      </div>
    );
  }

  const roleOrder: Array<Profile['role']> = [
    'admin',
    'co_admin',
    'employee',
    'customer',
  ];
  const groupedUsers = roleOrder.map((role) => ({
    role,
    users: filteredUsers.filter((u) => u.role === role),
  }));

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">User Management</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage user roles and permissions
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-muted-foreground">Total Users</div>
          <div className="text-2xl font-bold text-foreground">
            {users.length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-muted-foreground">Admins</div>
          <div className="text-2xl font-bold text-purple-600">
            {users.filter((u) => u.role === 'admin').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-muted-foreground">Co-admins</div>
          <div className="text-2xl font-bold text-indigo-600">
            {users.filter((u) => u.role === 'co_admin').length}
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-sm text-muted-foreground">Employees</div>
          <div className="text-2xl font-bold text-blue-600">
            {users.filter((u) => u.role === 'employee').length}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Role filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="px-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Roles</option>
            <option value="admin">Admins</option>
            <option value="co_admin">Co-admins</option>
            <option value="employee">Employees</option>
            <option value="customer">Customers</option>
          </select>
        </div>
      </div>

      {/* Users Table Groups */}
      {groupedUsers.map((group) => (
        <div
          key={group.role}
          className="bg-white rounded-lg shadow overflow-hidden mb-6"
        >
          <div className="px-6 py-4 border-b bg-background/90">
            <h2 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">
              {group.role.replace('_', ' ')}
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-border">
                {group.users.map((user) => (
                  <tr key={user.id} className="hover:bg-secondary/70">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                            <span className="text-primary font-semibold">
                              {user.full_name?.charAt(0) ||
                                user.email.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-foreground">
                            {user.full_name || 'No name'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(
                          user.role
                        )}`}
                      >
                        {getRoleIcon(user.role)}
                        {user.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setSelectedRole(user.role);
                          setShowRoleModal(true);
                          loadPermissionsForUser(user.id);
                        }}
                        className="text-primary hover:text-primary/90 disabled:text-gray-300"
                        disabled={
                          user.id === currentUser?.id ||
                          (isCoAdmin &&
                            (user.role === 'admin' || user.role === 'co_admin'))
                        }
                      >
                        {user.id === currentUser?.id ? '(You)' : 'Manage'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {group.users.length === 0 && (
            <div className="text-center py-8">
              <AlertCircle className="h-10 w-10 text-gray-300 mx-auto mb-2" />
              <p className="text-muted-foreground text-sm">
                No users in this group
              </p>
            </div>
          )}
        </div>
      ))}

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No users found</p>
        </div>
      )}

      {/* Role Change Modal */}
      {showRoleModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Manage User
            </h3>

            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-2">User:</p>
              <p className="font-medium">
                {selectedUser.full_name || selectedUser.email}
              </p>
              <p className="text-sm text-muted-foreground">
                {selectedUser.email}
              </p>
            </div>

            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-3">Role:</p>
              <div className="space-y-2">
                {(isAdmin
                  ? (['customer', 'employee', 'co_admin', 'admin'] as const)
                  : (['customer', 'employee'] as const)
                ).map((role) => (
                  <button
                    key={role}
                    onClick={() => setSelectedRole(role)}
                    disabled={updating}
                    className={`w-full flex items-center gap-3 px-4 py-3 border-2 rounded-lg transition ${
                      selectedRole === role
                        ? 'border-primary bg-secondary'
                        : 'border-border hover:border-primary/40'
                    } ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {getRoleIcon(role)}
                    <span className="font-medium">
                      {role.replace('_', ' ')}
                    </span>
                    {selectedRole === role && (
                      <span className="ml-auto text-sm text-primary">
                        (Selected)
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-3">Privileges:</p>
              {loadingPermissions && (
                <p className="text-xs text-muted-foreground mb-2">
                  Loading permissions...
                </p>
              )}
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedPermissions?.can_manage_products ?? false}
                    onChange={(e) =>
                      setSelectedPermissions((prev) => ({
                        user_id: selectedUser.id,
                        can_manage_products: e.target.checked,
                        can_manage_tickets: prev?.can_manage_tickets ?? false,
                        can_promote_to_co_admin:
                          prev?.can_promote_to_co_admin ?? false,
                        created_at:
                          prev?.created_at ?? new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                      }))
                    }
                    disabled={loadingPermissions || updating}
                  />
                  <span className="text-sm text-foreground/80">
                    Handle products
                  </span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedPermissions?.can_manage_tickets ?? false}
                    onChange={(e) =>
                      setSelectedPermissions((prev) => ({
                        user_id: selectedUser.id,
                        can_manage_products: prev?.can_manage_products ?? false,
                        can_manage_tickets: e.target.checked,
                        can_promote_to_co_admin:
                          prev?.can_promote_to_co_admin ?? false,
                        created_at:
                          prev?.created_at ?? new Date().toISOString(),
                        updated_at: new Date().toISOString(),
                      }))
                    }
                    disabled={loadingPermissions || updating}
                  />
                  <span className="text-sm text-foreground/80">
                    Handle tickets
                  </span>
                </label>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedRole === 'co_admin'}
                    onChange={(e) =>
                      setSelectedRole(
                        e.target.checked
                          ? 'co_admin'
                          : selectedRole === 'co_admin'
                            ? 'employee'
                            : selectedRole
                      )
                    }
                    disabled={!isAdmin || updating}
                  />
                  <span className="text-sm text-foreground/80">
                    Make co-admin
                  </span>
                </label>
                {!isAdmin && (
                  <p className="text-xs text-muted-foreground">
                    Only admins can promote a user to co-admin.
                  </p>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRoleModal(false);
                  setSelectedUser(null);
                  setSelectedRole(null);
                  setSelectedPermissions(null);
                }}
                disabled={updating}
                className="flex-1 px-4 py-2 rounded-md btn-secondary disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={applyUserChanges}
                disabled={updating || loadingPermissions}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition disabled:opacity-50"
              >
                {updating ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
