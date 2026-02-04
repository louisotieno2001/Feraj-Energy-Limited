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

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
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
