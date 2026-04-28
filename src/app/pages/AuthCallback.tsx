import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const STAFF_ROLES = new Set(['admin', 'co_admin', 'employee']);

export function AuthCallback() {
  const navigate = useNavigate();
  const { user, profile, loading } = useAuth();
  const hasRedirectedRef = useRef(false);

  useEffect(() => {
    if (loading || hasRedirectedRef.current) {
      return;
    }

    // If the confirmation link is invalid or expired, send user back to login.
    if (!user) {
      hasRedirectedRef.current = true;
      navigate('/login', { replace: true });
      return;
    }

    // Do not route users into app pages until email has been confirmed.
    if (!user.email_confirmed_at) {
      hasRedirectedRef.current = true;
      navigate('/login', { replace: true });
      return;
    }

    if (!profile) {
      return;
    }

    hasRedirectedRef.current = true;
    navigate(STAFF_ROLES.has(profile.role) ? '/admin' : '/products', {
      replace: true,
    });
  }, [loading, navigate, profile, user]);

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <div className="rounded-xl border border-white/10 bg-white/5 p-6 text-center">
        <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-primary" />
        <p className="text-sm text-white/75">Finalizing your sign-in...</p>
      </div>
    </div>
  );
}
