import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface AdminRouteProps {
  children: ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { user, profile, loading } = useAuth();

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Verifying admin access...</p>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!user) {
    toast.error('Please log in to access admin panel');
    return <Navigate to="/login" replace />;
  }

  // Check if user has admin role
  if (profile?.role !== 'admin') {
    toast.error('Access denied. Admin privileges required.');
    return <Navigate to="/" replace />;
  }

  // User is authenticated and is an admin
  return <>{children}</>;
}
