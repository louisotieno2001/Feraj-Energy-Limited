import { Link } from 'react-router-dom';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const cartCount = JSON.parse(localStorage.getItem('cart') || '[]').length;
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

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
              <span className="text-xl font-bold text-gray-900">Feraj Solar Limited</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-700 hover:text-green-600 transition">Home</Link>
            <Link to="/products" className="text-gray-700 hover:text-green-600 transition">Products</Link>
            <Link to="/about" className="text-gray-700 hover:text-green-600 transition">About</Link>
            <Link to="/partnerships" className="text-gray-700 hover:text-green-600 transition">Partnerships</Link>
            <Link to="/why-green" className="text-gray-700 hover:text-green-600 transition">Why Green Energy</Link>
            <Link to="/energy-stats" className="text-gray-700 hover:text-green-600 transition">Energy Stats</Link>
            <Link to="/team" className="text-gray-700 hover:text-green-600 transition">Our Team</Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-6 w-6 text-gray-700 hover:text-green-600 transition" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            {isLoggedIn ? (
              <Link to="/login" onClick={() => localStorage.removeItem('isLoggedIn')} className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition">
                <User className="h-5 w-5" />
                Logout
              </Link>
            ) : (
              <Link to="/login" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-4">
            <Link to="/cart" className="relative">
              <ShoppingCart className="h-6 w-6 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-2 space-y-1">
            <Link to="/" className="block px-3 py-2 text-gray-700 hover:bg-green-50 rounded-md" onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/products" className="block px-3 py-2 text-gray-700 hover:bg-green-50 rounded-md" onClick={() => setIsOpen(false)}>Products</Link>
            <Link to="/about" className="block px-3 py-2 text-gray-700 hover:bg-green-50 rounded-md" onClick={() => setIsOpen(false)}>About</Link>
            <Link to="/partnerships" className="block px-3 py-2 text-gray-700 hover:bg-green-50 rounded-md" onClick={() => setIsOpen(false)}>Partnerships</Link>
            <Link to="/why-green" className="block px-3 py-2 text-gray-700 hover:bg-green-50 rounded-md" onClick={() => setIsOpen(false)}>Why Green Energy</Link>
            <Link to="/energy-stats" className="block px-3 py-2 text-gray-700 hover:bg-green-50 rounded-md" onClick={() => setIsOpen(false)}>Energy Stats</Link>
            <Link to="/team" className="block px-3 py-2 text-gray-700 hover:bg-green-50 rounded-md" onClick={() => setIsOpen(false)}>Our Team</Link>
            {isLoggedIn ? (
              <Link to="/login" onClick={() => { localStorage.removeItem('isLoggedIn'); setIsOpen(false); }} className="block px-3 py-2 text-gray-700 hover:bg-green-50 rounded-md">Logout</Link>
            ) : (
              <Link to="/login" className="block px-3 py-2 bg-green-600 text-white rounded-md text-center" onClick={() => setIsOpen(false)}>Login</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
