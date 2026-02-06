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
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const cartCount = JSON.parse(localStorage.getItem('cart') || '[]').length;
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isStaff =
    profile?.role && ['admin', 'co_admin', 'employee'].includes(profile.role);
  const isHome = location.pathname === '/';

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
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3">
              <img
                src="/images/logos/feraj-solar-logo.png"
                alt="Feraj Solar Limited Logo"
                className="h-12 w-12 object-contain"
              />
              <span className="text-xl font-bold text-foreground">
                Feraj Solar Limited
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {!isHome && (
              <Link
                to="/"
                className="text-foreground/80 hover:text-primary transition"
              >
                Home
              </Link>
            )}
            <Link
              to="/products"
              className="text-foreground/80 hover:text-primary transition"
            >
              Products
            </Link>
            <Link
              to="/about"
              className="text-foreground/80 hover:text-primary transition"
            >
              About
            </Link>
            <Link
              to="/team"
              className="text-foreground/80 hover:text-primary transition"
            >
              Our Team
            </Link>
            {isStaff && (
              <Link
                to="/admin"
                className="text-foreground/80 hover:text-primary transition font-medium"
              >
                Admin Panel
              </Link>
            )}

            {/* Resources Dropdown */}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger className="flex items-center gap-1 text-foreground/80 hover:text-primary transition focus:outline-none">
                Resources
                <ChevronDown className="h-4 w-4" />
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="min-w-[220px] bg-white rounded-md shadow-lg border border-border p-1 z-50"
                  sideOffset={5}
                >
                  <DropdownMenu.Item asChild>
                    <Link
                      to="/partnerships"
                      className="flex items-center gap-3 px-3 py-2 text-sm text-foreground/80 hover:bg-secondary hover:text-primary rounded cursor-pointer outline-none"
                    >
                      <Users className="h-4 w-4" />
                      Partnerships
                    </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item asChild>
                    <Link
                      to="/why-green"
                      className="flex items-center gap-3 px-3 py-2 text-sm text-foreground/80 hover:bg-secondary hover:text-primary rounded cursor-pointer outline-none"
                    >
                      <Lightbulb className="h-4 w-4" />
                      Why Green Energy
                    </Link>
                  </DropdownMenu.Item>
                  <DropdownMenu.Item asChild>
                    <Link
                      to="/energy-stats"
                      className="flex items-center gap-3 px-3 py-2 text-sm text-foreground/80 hover:bg-secondary hover:text-primary rounded cursor-pointer outline-none"
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
              <ShoppingCart className="h-6 w-6 text-foreground/80 hover:text-primary transition" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            {user ? (
              <>
                <Link
                  to="/orders"
                  className="text-foreground/80 hover:text-primary transition text-sm font-medium"
                >
                  Orders
                </Link>

                {/* User Account Dropdown */}
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger className="flex items-center gap-2 px-3 py-2 text-foreground/80 hover:bg-gray-100 rounded-md transition focus:outline-none">
                    <User className="h-5 w-5" />
                    <ChevronDown className="h-4 w-4" />
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Portal>
                    <DropdownMenu.Content
                      className="min-w-[200px] bg-white rounded-md shadow-lg border border-border p-1 z-50"
                      sideOffset={5}
                      align="end"
                    >
                      <div className="px-3 py-2 border-b border-border">
                        <p className="text-sm font-medium text-foreground truncate">
                          {profile?.full_name || 'User'}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </p>
                      </div>
                      <DropdownMenu.Item asChild>
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-3 py-2 text-sm text-foreground/80 hover:bg-secondary hover:text-primary rounded cursor-pointer outline-none mt-1"
                        >
                          <User className="h-4 w-4" />
                          My Profile
                        </Link>
                      </DropdownMenu.Item>
                      <DropdownMenu.Item asChild>
                        <Link
                          to="/devices"
                          className="flex items-center gap-3 px-3 py-2 text-sm text-foreground/80 hover:bg-secondary hover:text-primary rounded cursor-pointer outline-none"
                        >
                          <Activity className="h-4 w-4" />
                          My Devices
                        </Link>
                      </DropdownMenu.Item>
                      {isStaff && (
                        <DropdownMenu.Item asChild>
                          <Link
                            to="/admin"
                            className="flex items-center gap-3 px-3 py-2 text-sm text-foreground/80 hover:bg-secondary hover:text-primary rounded cursor-pointer outline-none"
                          >
                            <Users className="h-4 w-4" />
                            Admin Panel
                          </Link>
                        </DropdownMenu.Item>
                      )}
                      <DropdownMenu.Separator className="h-px bg-gray-200 my-1" />
                      <DropdownMenu.Item
                        onSelect={(e) => {
                          e.preventDefault();
                          handleSignOut();
                        }}
                      >
                        <button
                          type="button"
                          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded cursor-pointer outline-none"
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
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-6 w-6 text-foreground/80" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground/80"
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
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-2 space-y-1">
            {!isHome && (
              <Link
                to="/"
                className="block px-3 py-2 text-foreground/80 hover:bg-secondary rounded-md"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
            )}
            <Link
              to="/products"
              className="block px-3 py-2 text-foreground/80 hover:bg-secondary rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Products
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 text-foreground/80 hover:bg-secondary rounded-md"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>
            <Link
              to="/team"
              className="block px-3 py-2 text-foreground/80 hover:bg-secondary rounded-md"
              onClick={() => setIsOpen(false)}
            >
              Our Team
            </Link>

            {/* Resources Section */}
            <div className="pt-2 pb-1">
              <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Resources
              </p>
            </div>
            <Link
              to="/partnerships"
              className="block px-3 py-2 text-foreground/80 hover:bg-secondary rounded-md pl-6"
              onClick={() => setIsOpen(false)}
            >
              Partnerships
            </Link>
            <Link
              to="/why-green"
              className="block px-3 py-2 text-foreground/80 hover:bg-secondary rounded-md pl-6"
              onClick={() => setIsOpen(false)}
            >
              Why Green Energy
            </Link>
            <Link
              to="/energy-stats"
              className="block px-3 py-2 text-foreground/80 hover:bg-secondary rounded-md pl-6"
              onClick={() => setIsOpen(false)}
            >
              Energy Stats
            </Link>

            {user ? (
              <>
                <div className="pt-2 pb-1">
                  <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Account
                  </p>
                </div>
                <Link
                  to="/orders"
                  className="block px-3 py-2 text-foreground/80 hover:bg-secondary rounded-md font-medium pl-6"
                  onClick={() => setIsOpen(false)}
                >
                  Orders
                </Link>
                <Link
                  to="/profile"
                  className="block px-3 py-2 text-foreground/80 hover:bg-secondary rounded-md font-medium pl-6"
                  onClick={() => setIsOpen(false)}
                >
                  My Profile
                </Link>
                <Link
                  to="/devices"
                  className="block px-3 py-2 text-foreground/80 hover:bg-secondary rounded-md font-medium pl-6"
                  onClick={() => setIsOpen(false)}
                >
                  My Devices
                </Link>
                {isStaff && (
                  <Link
                    to="/admin"
                    className="block px-3 py-2 text-foreground/80 hover:bg-secondary rounded-md font-medium pl-6"
                    onClick={() => setIsOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-md pl-6"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block px-3 py-2 bg-primary text-white rounded-md text-center"
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
