import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingBag,
  LogOut,
  Menu,
  X,
  Home,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function AdminLayout() {
  const { profile, permissions, signOut } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isAdmin = profile?.role === 'admin';
  const isCoAdmin = profile?.role === 'co_admin';
  const isEmployee = profile?.role === 'employee';

  const canManageProducts =
    isAdmin || isCoAdmin || (isEmployee && permissions?.can_manage_products);

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, visible: true },
    {
      name: 'Users',
      href: '/admin/users',
      icon: Users,
      visible: isAdmin || isCoAdmin,
    },
    {
      name: 'Products',
      href: '/admin/products',
      icon: Package,
      visible: canManageProducts,
    },
    { name: 'Audit', href: '/admin/audit', icon: ShoppingBag, visible: true },
  ].filter((item) => item.visible);

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
    } catch {
      toast.error('Failed to log out');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b">
            <Link to="/admin" className="flex items-center gap-2">
              <LayoutDashboard className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-foreground">
                Admin Panel
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-muted-foreground hover:text-foreground/80"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const isActive =
                location.pathname === item.href ||
                (item.href !== '/admin' &&
                  location.pathname.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                    isActive
                      ? 'bg-secondary text-primary font-medium'
                      : 'text-foreground/80 hover:bg-secondary/70'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User info & actions */}
          <div className="border-t px-4 py-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                <span className="text-primary font-semibold">
                  {profile?.full_name?.charAt(0) ||
                    profile?.email?.charAt(0) ||
                    'A'}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {profile?.full_name || 'Admin'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {profile?.email}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Link
                to="/"
                className="flex items-center gap-2 px-3 py-2 text-sm text-foreground/80 hover:bg-secondary/70 rounded-md transition"
              >
                <Home className="h-4 w-4" />
                <span>Back to Site</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white shadow-sm">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-muted-foreground hover:text-foreground/80"
            >
              <Menu className="h-6 w-6" />
            </button>

            <div className="flex items-center gap-2 lg:hidden">
              <LayoutDashboard className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-foreground">Admin</span>
            </div>

            <div className="flex items-center gap-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-secondary text-primary">
                {profile?.role ? profile.role.replace('_', ' ') : 'Staff'}
              </span>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
