import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/images/logos/feraj-solar-logo.png"
                alt="Feraj Solar Limited Logo"
                className="h-12 w-12 object-contain"
              />
              <span className="text-xl font-bold text-white">
                Feraj Solar Limited
              </span>
            </div>
            <p className="text-sm mb-4">
              Leading Kenya&apos;s clean energy revolution with innovative solar
              solutions for a sustainable and energy-independent future.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-primary transition">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary transition">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary transition">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-primary transition">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-white font-semibold mb-4">Products</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/products" className="hover:text-primary transition">
                  Solar Panels
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-primary transition">
                  Inverters
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-primary transition">
                  Battery Storage
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-primary transition">
                  Mounting Systems
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-primary transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/team" className="hover:text-primary transition">
                  Our Team
                </Link>
              </li>
              <li>
                <Link
                  to="/partnerships"
                  className="hover:text-primary transition"
                >
                  Partnerships
                </Link>
              </li>
              <li>
                <Link
                  to="/energy-stats"
                  className="hover:text-primary transition"
                >
                  Energy Statistics
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-sm">
              <li>Email: ferajsolarlimited@gmail.com</li>
              <li>Phone: +254720944707 (Exec)</li>
              <li>Address: Timshack 5th Floor, Ngong Road,</li>
              <li>002 Nairobi, Kenya</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
          <p>
            &copy; {new Date().getFullYear()} Feraj Solar. All rights reserved.
            Powering a sustainable future.
          </p>
        </div>
      </div>
    </footer>
  );
}
