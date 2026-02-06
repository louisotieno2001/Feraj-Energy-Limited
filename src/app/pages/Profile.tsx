import { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  Building2,
  Calendar,
  Save,
  Shield,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { createAuditLog } from '@/services/audit.service';

export function Profile() {
  const { user, profile, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    company_name: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        phone: profile.phone || '',
        company_name: profile.company_name || '',
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const sensitiveBefore = {
        phone: profile?.phone || '',
        company_name: profile?.company_name || '',
      };
      const sensitiveAfter = {
        phone: formData.phone,
        company_name: formData.company_name,
      };
      const sensitiveChanged =
        sensitiveBefore.phone !== sensitiveAfter.phone ||
        sensitiveBefore.company_name !== sensitiveAfter.company_name;

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name,
          phone: formData.phone,
          company_name: formData.company_name,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user?.id);

      if (error) throw error;

      await refreshProfile();

      if (sensitiveChanged && user?.id) {
        await createAuditLog({
          actor_user_id: user.id,
          target_user_id: user.id,
          action: 'profile.update',
          metadata: {
            before: sensitiveBefore,
            after: sensitiveAfter,
          },
        });
      }

      toast.success('Profile updated successfully!');
      setEditing(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setLoading(false);
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

  if (!profile) {
    return (
      <div className="min-h-screen bg-background/90 py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Loading / Missing Profile State */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-6 w-48 bg-secondary/60 rounded" />
              <div className="h-4 w-80 bg-secondary/60 rounded" />
              <div className="h-24 w-full bg-secondary/60 rounded-lg" />
              <div className="h-4 w-64 bg-secondary/60 rounded" />
            </div>
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => refreshProfile()}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition"
                disabled={!user}
              >
                Retry
              </button>
              <a href="/" className="px-4 py-2 rounded-md btn-secondary">
                Back to Home
              </a>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              If this persists, ensure the Supabase profile trigger exists or
              backfill the profile record for your user.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background/90 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your account information and preferences
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Profile Header */}
          <div className="bg-gradient-to-r from-primary to-accent px-6 py-8">
            <div className="flex items-center gap-6">
              <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center">
                <User className="h-12 w-12 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white">
                  {profile.full_name || 'User'}
                </h2>
                <p className="text-white/80">{profile.email}</p>
                <div className="mt-2">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadgeColor(
                      profile.role
                    )}`}
                  >
                    <Shield className="h-3 w-3" />
                    {profile.role
                      .replace('_', ' ')
                      .replace(/\b\w/g, (char) => char.toUpperCase())}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.full_name}
                    onChange={(e) =>
                      setFormData({ ...formData, full_name: e.target.value })
                    }
                    disabled={!editing || loading}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              {/* Email (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-md bg-gray-100 text-muted-foreground"
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Email cannot be changed. Contact support if needed.
                </p>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    disabled={!editing || loading}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                    placeholder="+254 XXX XXXXXX"
                  />
                </div>
              </div>

              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">
                  Company Name (Optional)
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    type="text"
                    value={formData.company_name}
                    onChange={(e) =>
                      setFormData({ ...formData, company_name: e.target.value })
                    }
                    disabled={!editing || loading}
                    className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                    placeholder="Your Company Ltd"
                  />
                </div>
              </div>

              {/* Account Info */}
              <div className="border-t pt-6">
                <h3 className="text-sm font-medium text-foreground/80 mb-4">
                  Account Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Member since{' '}
                      {new Date(profile.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                {!editing ? (
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition disabled:opacity-50"
                    >
                      <Save className="h-4 w-4" />
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(false);
                        setFormData({
                          full_name: profile.full_name || '',
                          phone: profile.phone || '',
                          company_name: profile.company_name || '',
                        });
                      }}
                      disabled={loading}
                      className="px-6 py-2 rounded-md btn-secondary disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
