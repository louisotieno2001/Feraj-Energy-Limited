import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ShoppingCart,
  User,
  Menu,
  X,
  LogOut,
  ChevronDown,
  Lightbulb,
  TrendingUp,
  Users,
  Activity,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const cartCount = JSON.parse(localStorage.getItem('cart') || '[]').length;
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isStaff =
    profile?.role && ['admin', 'co_admin', 'employee'].includes(profile.role);
  const isHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => setIsCompact(window.scrollY > 28);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  const handleSignOut = async () => {
    try {
      setIsOpen(false);
      await signOut();
      toast.success('Logged out successfully');
      navigate('/login', { replace: true });
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error('Failed to log out. Please try again.');
    }
  };

  return (
    <nav
      className={`sticky top-0 z-50 border-b border-white/10 transition-all duration-300 ${
        isCompact
          ? 'bg-[#0c0c12]/88 backdrop-blur-xl'
          : 'bg-[#0c0c12]/72 backdrop-blur-md'
      }`}
    >
      <div className="mx-auto w-full max-w-[var(--section-max-width)] px-4 sm:px-6 lg:px-8">
        <div
          className={`flex justify-between transition-[height] duration-300 ${
            isCompact ? 'h-14' : 'h-[4.5rem]'
          }`}
        >
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/images/logos/feraj-solar-logo.png"
                alt="Feraj Solar Limited Logo"
                className={`object-contain transition-all duration-300 ${
                  isCompact ? 'h-9 w-9' : 'h-11 w-11'
                }`}
              />
              <span
                className={`font-semibold tracking-tight text-white/90 transition-all duration-300 ${
                  isCompact ? 'text-base' : 'text-lg'
                }`}
              >
                Feraj Solar Limited
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {!isHome && (
              <Link
                to="/"
                className="text-white/70 hover:text-white transition"
              >
                Home
              </Link>
            )}
            <Link
              to="/products"
              className="text-white/70 hover:text-white transition"
            >
              Products
            </Link>
            <Link
              to="/about"
              className="text-white/70 hover:text-white transition"
            >
              About
            </Link>
            <Link
              to="/team"
              className="text-white/70 hover:text-white transition"
            >
              Our Team
            </Link>
            {isStaff && (
              <Link
                to="/admin"
                className="text-white/85 hover:text-white transition font-medium"
              >
                Admin Panel
              </Link>
            )}

            {/* Resources Dropdown */}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger className="flex items-center gap-1 text-white/70 hover:text-white transition focus:outline-none">
                Resources
                <ChevronDown className="h-4 w-4" />
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="z-50 min-w-[220px] rounded-lg border border-white/10 bg-[#10111a]/95 p-1.5 text-white/85 shadow-2xl backdrop-blur-xl"
                  sideOffset={5}
                >
                  <DropdownMenu.Item asChild>
                    <Link
                      to="/partnerships"
                      className="flex items-center gap-3 rounded px-3 py-2 text-sm hover:bg-white/10 hover:text-white cursor-pointer outline-none"
                    >
                      <Users className="h-4 w-4" />
                      Partnerships
                    </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item asChild>
                    <Link
                      to="/why-green"
                      className="flex items-center gap-3 rounded px-3 py-2 text-sm hover:bg-white/10 hover:text-white cursor-pointer outline-none"
                    >
                      <Lightbulb className="h-4 w-4" />
                      Why Green Energy
                    </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item asChild>
                    <Link
                      to="/energy-stats"
                      className="flex items-center gap-3 rounded px-3 py-2 text-sm hover:bg-white/10 hover:text-white cursor-pointer outline-none"
                    >
                      <TrendingUp className="h-4 w-4" />
                      Energy Stats
                    </Link>
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-5 w-5 text-white/75 hover:text-white transition" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </Link>
            {user ? (
              <>
                <Link
                  to="/orders"
                  className="text-sm font-medium text-white/75 hover:text-white transition"
                >
                  Orders
                </Link>

                {/* User Account Dropdown */}
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger className="flex items-center gap-2 rounded-md px-3 py-2 text-white/75 hover:bg-white/10 transition focus:outline-none">
                    <User className="h-5 w-5" />
                    <ChevronDown className="h-4 w-4" />
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      className="z-50 min-w-[200px] rounded-lg border border-white/10 bg-[#10111a]/95 p-1.5 text-white/85 shadow-2xl backdrop-blur-xl"
                      sideOffset={5}
                      align="end"
                    >
                      <div className="border-b border-white/10 px-3 py-2">
                        <p className="truncate text-sm font-medium text-white/90">
                          {profile?.full_name || 'User'}
                        </p>
                        <p className="truncate text-xs text-white/55">
                          {user.email}
                        </p>
                      </div>
                      <DropdownMenu.Item asChild>
                        <Link
                          to="/profile"
                          className="mt-1 flex items-center gap-3 rounded px-3 py-2 text-sm hover:bg-white/10 hover:text-white cursor-pointer outline-none"
                        >
                          <User className="h-4 w-4" />
                          My Profile
                        </Link>
                      </DropdownMenu.Item>
                      <DropdownMenu.Item asChild>
                        <Link
                          to="/devices"
                          className="flex items-center gap-3 rounded px-3 py-2 text-sm hover:bg-white/10 hover:text-white cursor-pointer outline-none"
                        >
                          <Activity className="h-4 w-4" />
                          My Devices
                        </Link>
                      </DropdownMenu.Item>
                      {isStaff && (
                        <DropdownMenu.Item asChild>
                          <Link
                            to="/admin"
                            className="flex items-center gap-3 rounded px-3 py-2 text-sm hover:bg-white/10 hover:text-white cursor-pointer outline-none"
                          >
                            <Users className="h-4 w-4" />
                            Admin Panel
                          </Link>
                        </DropdownMenu.Item>
                      )}
                      <DropdownMenu.Separator className="my-1 h-px bg-white/10" />
                      <DropdownMenu.Item
                        onSelect={(e) => {
                          e.preventDefault();
                          handleSignOut();
                        }}
                      >
                        <button
                          type="button"
                          className="flex w-full items-center gap-3 rounded px-3 py-2 text-sm text-red-300 hover:bg-red-500/12 cursor-pointer outline-none"
                        >
                          <LogOut className="h-4 w-4" />
                          Logout
                        </button>
                      </DropdownMenu.Item>
                    </DropdownMenu.Content>
                  </DropdownMenu.Portal>
                </DropdownMenu.Root>
              </>
            ) : (
              <Link
                to="/login"
                className="rounded-md border border-primary/40 bg-primary/90 px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary transition"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-5 w-5 text-white/75" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-md p-1 text-white/80 hover:bg-white/10"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="border-t border-white/10 bg-[#10111a]/96 backdrop-blur-xl md:hidden">
          <div className="px-4 py-2 space-y-1">
            {!isHome && (
              <Link
                to="/"
                className="block rounded-md px-3 py-2 text-white/78 hover:bg-white/10"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
            )}
            <Link
              to="/products"
              className="block rounded-md px-3 py-2 text-white/78 hover:bg-white/10"
              onClick={() => setIsOpen(false)}
            >
              Products
            </Link>
            <Link
              to="/about"
              className="block rounded-md px-3 py-2 text-white/78 hover:bg-white/10"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              to="/team"
              className="block rounded-md px-3 py-2 text-white/78 hover:bg-white/10"
              onClick={() => setIsOpen(false)}
            >
              Our Team
            </Link>

            {/* Resources Section */}
            <div className="pt-2 pb-1">
              <p className="px-3 text-xs font-semibold text-white/45 uppercase tracking-wider">
                Resources
              </p>
            </div>
            <Link
              to="/partnerships"
              className="block rounded-md px-3 py-2 pl-6 text-white/70 hover:bg-white/10"
              onClick={() => setIsOpen(false)}
            >
              Partnerships
            </Link>
            <Link
              to="/why-green"
              className="block rounded-md px-3 py-2 pl-6 text-white/70 hover:bg-white/10"
              onClick={() => setIsOpen(false)}
            >
              Why Green Energy
            </Link>
            <Link
              to="/energy-stats"
              className="block rounded-md px-3 py-2 pl-6 text-white/70 hover:bg-white/10"
              onClick={() => setIsOpen(false)}
            >
              Energy Stats
            </Link>

            {user ? (
              <>
                <div className="pt-2 pb-1">
                  <p className="px-3 text-xs font-semibold text-white/45 uppercase tracking-wider">
                    Account
                  </p>
                </div>
                <Link
                  to="/orders"
                  className="block rounded-md px-3 py-2 pl-6 text-white/78 hover:bg-white/10 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Orders
                </Link>
                <Link
                  to="/profile"
                  className="block rounded-md px-3 py-2 pl-6 text-white/78 hover:bg-white/10 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  My Profile
                </Link>
                <Link
                  to="/devices"
                  className="block rounded-md px-3 py-2 pl-6 text-white/78 hover:bg-white/10 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  My Devices
                </Link>
                {isStaff && (
                  <Link
                    to="/admin"
                    className="block rounded-md px-3 py-2 pl-6 text-white/78 hover:bg-white/10 font-medium"
                    onClick={() => setIsOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="block w-full rounded-md px-3 py-2 pl-6 text-left text-red-300 hover:bg-red-500/12"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="mt-2 block rounded-md border border-primary/40 bg-primary/90 px-3 py-2 text-center font-semibold text-primary-foreground"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
