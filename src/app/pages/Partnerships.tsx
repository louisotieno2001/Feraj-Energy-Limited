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
    <div className="min-h-screen text-white/86">
      <section className="relative min-h-[40vh] flex items-center py-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(73,201,255,0.12),transparent_38%),radial-gradient(circle_at_75%_80%,rgba(49,209,122,0.1),transparent_42%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
          <p className="cinematic-eyebrow mb-6">Collaboration • Chapter 07</p>
          <h1 className="text-5xl md:text-7xl font-bold text-white/92 mb-8">
            Strategic Partnerships
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-white/60 leading-relaxed">
            Collaborating with industry leaders to deliver comprehensive solar
            solutions and drive global clean energy adoption
          </p>
        </div>
      </section>

      <section className="py-24 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24 animate-reveal">
            <h2 className="text-4xl font-bold mb-6 text-white/92">Why Partner With Us</h2>
            <p className="text-xl text-white/50 max-w-2xl mx-auto">
              Building the future of energy together through global innovation and trusted expertise
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-32">
            <div className="text-center animate-reveal" style={{ '--reveal-delay': '0s' } as any}>
              <div className="h-16 w-16 bg-accent/5 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-accent/20">
                <Globe2 className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white/90">Global Reach</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                Operations in 60+ countries across 6 continents
              </p>
            </div>

            <div className="text-center animate-reveal" style={{ '--reveal-delay': '0.1s' } as any}>
              <div className="h-16 w-16 bg-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-primary/20">
                <Award className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white/90">Industry Leader</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                25+ years of solar innovation excellence
              </p>
            </div>

            <div className="text-center animate-reveal" style={{ '--reveal-delay': '0.2s' } as any}>
              <div className="h-16 w-16 bg-accent/5 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-accent/20">
                <Building2 className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white/90">Enterprise Scale</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                500K+ installations generating 2.5GW capacity
              </p>
            </div>

            <div className="text-center animate-reveal" style={{ '--reveal-delay': '0.3s' } as any}>
              <div className="h-16 w-16 bg-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-8 border border-primary/20">
                <Handshake className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4 text-white/90">Trusted Partner</h3>
              <p className="text-white/50 text-sm leading-relaxed">
                98% customer satisfaction and retention
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {partners.map((partner, idx) => (
              <div
                key={idx}
                className="group border-l-2 border-white/10 pl-8 pb-10 transition-all hover:border-primary animate-reveal"
                style={{ '--reveal-delay': `${idx * 0.05}s` } as any}
              >
                <div className="text-primary text-xs font-bold uppercase tracking-widest mb-3 opacity-60 group-hover:opacity-100 transition-opacity">
                  {partner.type}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white/90 group-hover:text-white transition-colors">
                  {partner.name}
                </h3>
                <p className="text-white/50 leading-relaxed text-sm">{partner.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-32 border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-reveal">
          <h2 className="text-4xl font-bold mb-8 text-white/92">Become a Partner</h2>
          <p className="text-xl text-white/50 mb-10 leading-relaxed">
            Join our network of innovators, manufacturers, and distributors
            shaping the future of renewable energy in East Africa.
          </p>
          <button className="px-10 py-4 bg-primary/10 border border-primary/40 text-primary rounded-lg hover:bg-primary transition-all font-bold uppercase tracking-widest text-sm">
            Contact Partnership Team
          </button>
        </div>
      </section>
    </div>
  );
}
