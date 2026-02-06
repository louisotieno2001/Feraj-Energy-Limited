import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Navbar } from '@/app/components/Navbar';
import { Footer } from '@/app/components/Footer';
import { ProtectedRoute } from '@/app/components/ProtectedRoute';
import { AdminRoute } from '@/app/components/AdminRoute';
import { AdminLayout } from '@/app/components/layouts/AdminLayout';
import { Home } from '@/app/pages/Home';
import { Products } from '@/app/pages/Products';
import { Cart } from '@/app/pages/Cart';
import { Orders } from '@/app/pages/Orders';
import { Profile } from '@/app/pages/Profile';
import { Devices } from '@/app/pages/Devices';
import { Login } from '@/app/pages/Login';
import { ResetPassword } from '@/app/pages/ResetPassword';
import { About } from '@/app/pages/About';
import { Partnerships } from '@/app/pages/Partnerships';
import { WhyGreen } from '@/app/pages/WhyGreen';
import { EnergyStats } from '@/app/pages/EnergyStats';
import { Team } from '@/app/pages/Team';
import { AdminDashboard } from '@/app/pages/admin/Dashboard';
import { AdminUsers } from '@/app/pages/admin/Users';
import { AdminProducts } from '@/app/pages/admin/Products';
import { AdminAudit } from '@/app/pages/admin/Audit';
import { AdminDevices } from '@/app/pages/admin/Devices';

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };

    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });
    window.addEventListener('resize', updateScroll);

    return () => {
      window.removeEventListener('scroll', updateScroll);
      window.removeEventListener('resize', updateScroll);
    };
  }, []);

  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <div className="fixed top-0 left-0 z-[60] h-1 w-full bg-transparent">
          <div
            className="h-full bg-gradient-to-r from-primary via-accent to-primary transition-[width] duration-150 ease-out"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
        <Toaster position="top-right" richColors />
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/about" element={<About />} />
            <Route path="/partnerships" element={<Partnerships />} />
            <Route path="/why-green" element={<WhyGreen />} />
            <Route path="/energy-stats" element={<EnergyStats />} />
            <Route path="/team" element={<Team />} />

            {/* Protected Routes */}
            <Route
              path="/cart"
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/devices"
              element={
                <ProtectedRoute>
                  <Devices />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/*"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="devices" element={<AdminDevices />} />
              <Route path="audit" element={<AdminAudit />} />
              <Route path="orders" element={<Orders />} />
            </Route>
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
