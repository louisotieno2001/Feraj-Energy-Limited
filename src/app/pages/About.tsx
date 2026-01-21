import { Target, Eye, Award, Users, Globe, Lightbulb } from 'lucide-react';

export function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-r from-green-600 to-emerald-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-6">About Feraj Solar Limited</h1>
          <p className="text-xl max-w-3xl text-green-50">
            Leading Kenya's clean energy transformation through innovative solar solutions, making sustainable energy accessible to every community across the nation.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-lg">
              <div className="h-12 w-12 bg-green-600 rounded-lg flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Our Mission</h2>
              <p className="text-gray-700 leading-relaxed">
                To accelerate the global transition to sustainable energy by delivering cutting-edge solar technology that is accessible, reliable, and affordable for everyone. We are committed to reducing carbon emissions and creating a cleaner planet for future generations.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-lg">
              <div className="h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Our Vision</h2>
              <p className="text-gray-700 leading-relaxed">
                A world where clean, renewable energy powers every home, business, and community. We envision a sustainable future where solar energy is the primary power source, creating energy independence and environmental harmony globally.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-gray-900">Our Story</h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Founded with a vision to transform Kenya's energy landscape, Feraj Solar Limited started with a simple mission: make clean solar energy accessible to every Kenyan home and business.
                </p>
                <p>
                  Led by our dedicated team of directors - CEO Mr Joshua Orwa, Directors Mr Jerry Onyango and Mr Max Feng, and Director of Operations Mr Bonkee Omwai - we have grown into a trusted solar solutions provider across Kenya.
                </p>
                <p>
                  Our journey has been driven by innovation, community focus, and an unwavering commitment to sustainability. Every solar system we install brings Kenya closer to energy independence and environmental conservation.
                </p>
                <p>
                  Today, we're not just providing solar panels—we're pioneering affordable energy storage solutions, smart grid integration, and locally-adapted energy management systems that are reshaping Kenya's energy future.
                </p>
              </div>
            </div>
            <div>
              <img
                src="https://images.unsplash.com/photo-1758518732175-5d608ba3abdf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHRlYW0lMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzY4ODkzMjA5fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Team"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600">Principles that guide every decision we make</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lightbulb className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Innovation</h3>
              <p className="text-gray-600">
                Constantly pushing boundaries with cutting-edge technology and creative solutions
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Sustainability</h3>
              <p className="text-gray-600">
                Environmental responsibility in every product, process, and partnership
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Excellence</h3>
              <p className="text-gray-600">
                Uncompromising quality standards and superior customer service
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900">Integrity</h3>
              <p className="text-gray-600">
                Transparency, honesty, and ethical practices in all our operations
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Achievements & Milestones</h2>
          
          <div className="space-y-8">
            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-32 text-right">
                <div className="text-2xl font-bold text-green-600">2023</div>
              </div>
              <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-semibold text-lg mb-2">Reached 500,000 Global Installations</h3>
                <p className="text-gray-600">
                  Celebrated installing our 500,000th solar system, generating enough clean energy to power 250,000 homes annually
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-32 text-right">
                <div className="text-2xl font-bold text-green-600">2021</div>
              </div>
              <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-semibold text-lg mb-2">Launched Next-Gen Battery Storage</h3>
                <p className="text-gray-600">
                  Introduced PowerBank series with revolutionary 15-year warranty and 95% efficiency rating
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-32 text-right">
                <div className="text-2xl font-bold text-green-600">2019</div>
              </div>
              <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-semibold text-lg mb-2">Global Expansion to 60 Countries</h3>
                <p className="text-gray-600">
                  Established operations across six continents, making clean energy accessible worldwide
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-32 text-right">
                <div className="text-2xl font-bold text-green-600">2015</div>
              </div>
              <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-semibold text-lg mb-2">24% Efficiency Breakthrough</h3>
                <p className="text-gray-600">
                  Achieved industry-leading 24% panel efficiency with our proprietary PERC technology
                </p>
              </div>
            </div>

            <div className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-32 text-right">
                <div className="text-2xl font-bold text-green-600">1998</div>
              </div>
              <div className="flex-1 bg-white p-6 rounded-lg shadow-md">
                <h3 className="font-semibold text-lg mb-2">Company Founded</h3>
                <p className="text-gray-600">
                  Dr. Sarah Chen and team establish SolarTech with a vision to democratize solar energy
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
