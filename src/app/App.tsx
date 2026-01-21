import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Navbar } from '@/app/components/Navbar';
import { Footer } from '@/app/components/Footer';
import { Home } from '@/app/pages/Home';
import { Products } from '@/app/pages/Products';
import { Cart } from '@/app/pages/Cart';
import { Login } from '@/app/pages/Login';
import { About } from '@/app/pages/About';
import { Partnerships } from '@/app/pages/Partnerships';
import { WhyGreen } from '@/app/pages/WhyGreen';
import { EnergyStats } from '@/app/pages/EnergyStats';
import { Team } from '@/app/pages/Team';

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
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
            <Route path="/partnerships" element={<Partnerships />} />
            <Route path="/why-green" element={<WhyGreen />} />
            <Route path="/energy-stats" element={<EnergyStats />} />
            <Route path="/team" element={<Team />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
