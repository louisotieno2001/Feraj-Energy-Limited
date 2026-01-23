import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, TrendingUp, Users, Award, Leaf } from 'lucide-react';

export function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[600px] bg-gradient-to-r from-green-600 to-emerald-500 text-white">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1545209575-704d1434f9cd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMHBhbmVscyUyMGVuZXJneXxlbnwxfHx8fDE3Njg4ODkxNzV8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Solar panels"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Powering Tomorrow with Clean Energy Today
            </h1>
            <p className="text-xl mb-8 text-green-50">
              Join the solar revolution. Advanced technology, sustainable solutions, and unmatched reliability for your home or business.
            </p>
            <div className="flex gap-4">
              <Link to="/products" className="px-8 py-3 bg-white text-green-600 rounded-md font-semibold hover:bg-green-50 transition flex items-center gap-2">
                Shop Products <ArrowRight className="h-5 w-5" />
              </Link>
              <Link to="/energy-stats" className="px-8 py-3 bg-green-700 text-white rounded-md font-semibold hover:bg-green-800 transition">
                View Energy Stats
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">25+</div>
              <div className="text-gray-600">Years Experience</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">500K+</div>
              <div className="text-gray-600">Installations</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">98%</div>
              <div className="text-gray-600">Customer Satisfaction</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">2.5GW</div>
              <div className="text-gray-600">Total Capacity</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Feraj Solar?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Industry-leading technology and service excellence for your renewable energy needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Maximum Efficiency</h3>
              <p className="text-gray-600">
                Our panels deliver up to 24% efficiency with advanced PERC and bifacial technology, ensuring optimal energy generation.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">30-Year Warranty</h3>
              <p className="text-gray-600">
                Industry-leading warranty coverage protecting your investment with guaranteed performance for three decades.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Smart Monitoring</h3>
              <p className="text-gray-600">
                Real-time energy production tracking and AI-powered optimization through our mobile app and web platform.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Expert Support</h3>
              <p className="text-gray-600">
                Dedicated customer service team and certified installers ensuring seamless experience from consultation to maintenance.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Award className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Award Winning</h3>
              <p className="text-gray-600">
                Recognized globally for innovation and sustainability, winning multiple industry awards for product excellence.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition">
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Leaf className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Carbon Neutral</h3>
              <p className="text-gray-600">
                Every installation offsets tons of CO2 annually, contributing to global climate action and environmental sustainability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Image Gallery Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Solutions in Action</h2>
            <p className="text-xl text-gray-600">Real installations making a real difference</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="relative h-64 rounded-lg overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1594373237925-5c674eda43b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMGVuZXJneSUyMHJlbmV3YWJsZXxlbnwxfHx8fDE3Njg5NTcwMzh8MA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Solar installation"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="relative h-64 rounded-lg overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1723177548474-b58ada59986b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2xhciUyMHBvd2VyJTIwaW5zdGFsbGF0aW9ufGVufDF8fHx8MTc2ODkwODA2Mnww&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Solar panels on roof"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="relative h-64 rounded-lg overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1487875961445-47a00398c267?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMHRlY2hub2xvZ3l8ZW58MXx8fHwxNzY4OTI2MzYwfDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Sustainable technology"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Go Solar?</h2>
          <p className="text-xl mb-8 text-green-50">
            Join thousands of satisfied customers who have made the switch to clean, renewable energy.
          </p>
          <Link to="/products" className="inline-flex items-center gap-2 px-8 py-3 bg-white text-green-600 rounded-md font-semibold hover:bg-green-50 transition">
            Browse Products <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
