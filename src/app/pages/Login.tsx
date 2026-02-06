import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { AuthService } from '@/services/auth.service';
import { registerSchema, loginSchema } from '@/utils/validation';
import { useAuth } from '@/contexts/AuthContext';
import type { ZodError } from 'zod';

export function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user && profile) {
      if (['admin', 'co_admin', 'employee'].includes(profile.role)) {
        navigate('/admin', { replace: true });
      } else {
        navigate('/products', { replace: true });
      }
    }
  }, [user, profile, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Validate login input
        loginSchema.parse({ email, password });

        // Sign in
        const { error } = await AuthService.signIn(email, password);

        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast.error('Invalid email or password');
          } else if (error.message.includes('Email not confirmed')) {
            toast.error('Please verify your email before logging in');
          } else {
            toast.error(error.message);
          }
          return;
        }

        toast.success('Login successful!');
        navigate('/products');
      } else {
        // Validate signup input
        registerSchema.parse({ email, password, fullName });

        // Sign up
        const { error } = await AuthService.signUp(email, password, fullName);

        if (error) {
          if (error.message.includes('already registered')) {
            toast.error('An account with this email already exists');
          } else {
            toast.error(error.message);
          }
          return;
        }

        toast.success(
          'Account created! Please check your email to verify your account.'
        );
        setEmailSent(true);
        setIsLogin(true);
      }
    } catch (error: any) {
      if (error.errors) {
        // Zod validation error
        const zodError = error as ZodError;
        const firstError = zodError.errors[0];
        toast.error(firstError.message);
      } else {
        toast.error('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!email) {
        toast.error('Please enter your email address');
        return;
      }

      const { error } = await AuthService.resetPassword(email);

      if (error) {
        toast.error(error.message);
        return;
      }

      toast.success('Password reset email sent! Check your inbox.');
      setShowResetPassword(false);
      setEmailSent(true);
    } catch {
      toast.error('Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background/90 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-3">
              <img
                src="/images/logos/feraj-solar-logo.png"
                alt="Feraj Solar Limited Logo"
                className="h-16 w-16 object-contain"
              />
              <span className="text-2xl font-bold text-foreground">
                Feraj Solar Limited
              </span>
            </div>
          </div>

          {/* Email verification notice */}
          {emailSent && (
            <div className="mb-6 p-4 bg-secondary border border-primary/20 rounded-md flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-primary">
                  Please check your email and click the verification link to
                  activate your account.
                </p>
              </div>
            </div>
          )}

          {/* Reset Password Form */}
          {showResetPassword ? (
            <>
              <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
                Reset Password
              </h2>
              <p className="text-sm text-muted-foreground mb-6 text-center">
                Enter your email address and we&apos;ll send you a link to reset
                your password.
              </p>
              <form onSubmit={handleResetPassword} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                      className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-primary text-white rounded-md font-semibold hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending...' : 'Send Reset Link'}
                </button>

                <button
                  type="button"
                  onClick={() => setShowResetPassword(false)}
                  className="w-full text-sm text-primary hover:text-primary font-semibold"
                >
                  Back to Login
                </button>
              </form>
            </>
          ) : (
            <>
              {/* Tabs */}
              <div className="flex gap-4 mb-8">
                <button
                  onClick={() => {
                    setIsLogin(true);
                    setEmailSent(false);
                  }}
                  className={`flex-1 py-2 text-center font-semibold rounded-md transition ${
                    isLogin
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-foreground/80 hover:bg-gray-200'
                  }`}
                >
                  Login
                </button>
                <button
                  onClick={() => {
                    setIsLogin(false);
                    setEmailSent(false);
                  }}
                  className={`flex-1 py-2 text-center font-semibold rounded-md transition ${
                    !isLogin
                      ? 'bg-primary text-white'
                      : 'bg-gray-100 text-foreground/80 hover:bg-gray-200'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-foreground/80 mb-2">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required={!isLogin}
                        disabled={loading}
                        className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                        placeholder="John Doe"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                      className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                      className="w-full pl-10 pr-4 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent disabled:bg-gray-100"
                      placeholder="••••••••"
                    />
                  </div>
                  {!isLogin && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      Must be at least 8 characters with uppercase, lowercase,
                      number, and special character
                    </p>
                  )}
                </div>

                {isLogin && (
                  <div className="flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => setShowResetPassword(true)}
                      className="text-sm text-primary hover:text-primary"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-primary text-white rounded-md font-semibold hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      {isLogin ? 'Signing in...' : 'Creating account...'}
                    </span>
                  ) : isLogin ? (
                    'Sign In'
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                {isLogin
                  ? "Don't have an account? "
                  : 'Already have an account? '}
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setEmailSent(false);
                  }}
                  disabled={loading}
                  className="text-primary hover:text-primary font-semibold disabled:opacity-50"
                >
                  {isLogin ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
