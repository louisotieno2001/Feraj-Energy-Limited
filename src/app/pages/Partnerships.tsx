import { Building2, Handshake, Globe2, Award } from 'lucide-react';

export function Partnerships() {
  const partners = [
    {
      name: 'Tesla Energy',
      type: 'Technology Partner',
      description: 'Integrated battery solutions',
    },
    {
      name: 'Google',
      type: 'Data Analytics',
      description: 'AI-powered energy optimization',
    },
    {
      name: 'Microsoft Azure',
      type: 'Cloud Services',
      description: 'IoT and monitoring platform',
    },
    {
      name: 'LG Electronics',
      type: 'Manufacturing',
      description: 'Solar panel production',
    },
    {
      name: 'Schneider Electric',
      type: 'Distribution',
      description: 'Global supply chain',
    },
    { name: 'ABB', type: 'Automation', description: 'Smart grid technology' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-6">Strategic Partnerships</h1>
          <p className="text-xl max-w-3xl text-blue-50">
            Collaborating with industry leaders to deliver comprehensive solar
            solutions and drive global clean energy adoption
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Partner With Us</h2>
            <p className="text-xl text-muted-foreground">
              Building the future of energy together
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20">
            <div className="text-center">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe2 className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Global Reach</h3>
              <p className="text-muted-foreground text-sm">
                Operations in 60+ countries across 6 continents
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Industry Leader</h3>
              <p className="text-muted-foreground text-sm">
                25+ years of solar innovation excellence
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Enterprise Scale</h3>
              <p className="text-muted-foreground text-sm">
                500K+ installations generating 2.5GW capacity
              </p>
            </div>

            <div className="text-center">
              <div className="h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Handshake className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">Trusted Partner</h3>
              <p className="text-muted-foreground text-sm">
                98% customer satisfaction and retention
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {partners.map((partner, idx) => (
              <div
                key={idx}
                className="bg-background/90 p-6 rounded-lg hover:shadow-lg transition"
              >
                <div className="text-blue-600 font-semibold mb-1">
                  {partner.type}
                </div>
                <h3 className="text-xl font-bold mb-2">{partner.name}</h3>
                <p className="text-muted-foreground">{partner.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-background/90">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Become a Partner</h2>
          <p className="text-muted-foreground mb-8">
            Join our network of innovators, manufacturers, and distributors
            shaping the future of renewable energy
          </p>
          <button className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-semibold">
            Contact Partnership Team
          </button>
        </div>
      </section>
    </div>
  );
}
