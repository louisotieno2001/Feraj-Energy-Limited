import { Target, Eye, Award, Users, Globe, Lightbulb, Zap, Leaf } from 'lucide-react';

export function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background">
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 right-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="space-y-6 animate-reveal-up-soft">
            <h1 className="text-6xl md:text-7xl font-bold text-white/92">
              About Feraj Solar
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl text-white/64 leading-relaxed">
              Dedicated to delivering reliable, affordable & sustainable power solutions across East Africa through innovative solar technology and expert installation.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mission */}
            <div className="cinematic-panel p-8 animate-reveal-up-soft" style={{ animationDelay: '0.1s' }}>
              <div className="h-12 w-12 border border-primary/50 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-white/92">
                Our Mission
              </h2>
              <p className="text-white/64 leading-relaxed">
                To deliver innovative and accessible solar energy solutions that empower homes, businesses, and communities across East Africa, while promoting environmental sustainability and energy independence.
              </p>
            </div>

            {/* Vision */}
            <div className="cinematic-panel p-8 border-accent/25 animate-reveal-up-soft" style={{ animationDelay: '0.2s' }}>
              <div className="h-12 w-12 border border-accent/50 bg-accent/10 rounded-lg flex items-center justify-center mb-6">
                <Eye className="h-6 w-6 text-accent" />
              </div>
              <h2 className="text-2xl font-bold mb-4 text-white/92">
                Our Vision
              </h2>
              <p className="text-white/64 leading-relaxed">
                The leading provider of sustainable energy solutions across East Africa, transforming lives and industries through reliable, clean, and affordable solar power.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-24 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-reveal-up-soft">
              <div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white/92">
                  What We Do
                </h2>
                <p className="text-lg text-white/64 leading-relaxed">
                  Feraj Solar Limited is a comprehensive solar energy solutions provider serving East Africa. We operate as solar importers, contractors, and vendors—delivering complete end-to-end solar installations.
                </p>
              </div>
              
              <div className="space-y-4">
                <div className="cinematic-panel p-6 border-primary/25">
                  <div className="flex gap-4 items-start">
                    <Zap className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-white/92 mb-2">Solar Installation</h3>
                      <p className="text-white/64">Professional installation of solar systems for homes, businesses, and manufacturing industries</p>
                    </div>
                  </div>
                </div>
                
                <div className="cinematic-panel p-6 border-accent/25">
                  <div className="flex gap-4 items-start">
                    <Leaf className="h-6 w-6 text-accent flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-semibold text-white/92 mb-2">Energy Independence</h3>
                      <p className="text-white/64">Empowering communities through off-grid solar solutions for long-term savings and independence</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="cinematic-panel p-8 border-gradient-to-br border-primary/25 animate-reveal-up-soft" style={{ animationDelay: '0.2s' }}>
              <h3 className="text-2xl font-bold mb-8 text-white/92">Why Choose Feraj?</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-primary mb-2 font-semibold">Quality First</h4>
                  <p className="text-white/64 text-sm">Industry-leading components and expert installation ensure maximum efficiency</p>
                </div>
                <div>
                  <h4 className="text-accent mb-2 font-semibold">Innovation Driven</h4>
                  <p className="text-white/64 text-sm">Latest solar technology adapted for East African climate and conditions</p>
                </div>
                <div>
                  <h4 className="text-primary mb-2 font-semibold">Customer Focused</h4>
                  <p className="text-white/64 text-sm">Dedicated support from consultation through installation and beyond</p>
                </div>
                <div>
                  <h4 className="text-accent mb-2 font-semibold">Sustainable Impact</h4>
                  <p className="text-white/64 text-sm">Every installation contributes to environmental conservation and energy independence</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6 animate-reveal-up-soft">
              <h2 className="text-4xl md:text-5xl font-bold text-white/92">
                Our Story
              </h2>
              <div className="space-y-4 text-white/64 leading-relaxed">
                <p>
                  Feraj Solar Limited was founded with a vision to transform energy access across East Africa. We recognized that reliable, affordable solar power could empower communities and industries while protecting our environment.
                </p>
                <p>
                  What started as a commitment to quality and innovation has grown into a trusted solar solutions provider across the region. We believe in the power of solar energy to create lasting change—not just in energy access, but in the lives and livelihoods of every community we serve.
                </p>
                <p>
                  Our mission is clear: help turn entire regions into off-grid, sustainable, and energy-independent through accessible solar technology. Today, every installation represents a step toward our vision of a fully renewable-powered East Africa.
                </p>
              </div>
            </div>
            <div className="cinematic-panel p-1 border-white/10 animate-reveal-up-soft" style={{ animationDelay: '0.2s' }}>
              <img
                src="https://images.unsplash.com/photo-1758518732175-5d608ba3abdf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHRlYW0lMjBwcm9mZXNzaW9uYWx8ZW58MXx8fHwxNzY4ODkzMjA5fDA&ixlib=rb-4.1.0&q=80&w=1080"
                alt="Team"
                className="rounded-lg w-full h-96 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-reveal-up-soft">
            <h2 className="text-4xl md:text-5xl font-bold text-white/92 mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-white/48">
              Principles that guide every decision we make
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Lightbulb,
                title: 'Innovation',
                description: 'Cutting-edge technology adapted for East African conditions and community needs',
                borderColor: 'border-primary/25',
                delay: '0s'
              },
              {
                icon: Leaf,
                title: 'Sustainability',
                description: 'Environmental responsibility in every product, installation, and partnership',
                borderColor: 'border-accent/25',
                delay: '0.1s'
              },
              {
                icon: Award,
                title: 'Quality',
                description: 'Uncompromising standards in materials, installation, and customer service',
                borderColor: 'border-primary/25',
                delay: '0.2s'
              },
              {
                icon: Users,
                title: 'Community Focus',
                description: 'Empowering lives through accessible energy and long-term value',
                borderColor: 'border-accent/25',
                delay: '0.3s'
              }
            ].map((value, idx) => {
              const Icon = value.icon;
              return (
                <div
                  key={idx}
                  className={`cinematic-panel p-6 ${value.borderColor} text-center animate-reveal-up-soft`}
                  style={{ animationDelay: value.delay }}
                >
                  <div className={`h-12 w-12 rounded-lg flex items-center justify-center mx-auto mb-4 border ${value.borderColor.replace('border-', 'border ')} ${value.borderColor.replace('border-', 'bg-').replace('/25', '/10')}`}>
                    <Icon className="h-6 w-6 text-white/92" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-white/92">
                    {value.title}
                  </h3>
                  <p className="text-white/64 text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-24 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-white/92 animate-reveal-up-soft">
            Milestones
          </h2>





          <div className="space-y-6 max-w-4xl mx-auto">
            {[
              {
                year: '2024',
                title: 'East Africa Leadership',
                description: 'Expanded operations across Kenya, Uganda, and Tanzania with regional distribution hubs',
                delay: '0s'
              },
              {
                year: '2023',
                title: 'Innovation in Energy Storage',
                description: 'Launched advanced battery storage solutions with real-time monitoring and off-grid optimization',
                delay: '0.1s'
              },
              {
                year: '2021',
                title: 'Contractor Network Growth',
                description: 'Established certified installer network across East Africa ensuring quality installations',
                delay: '0.2s'
              },
              {
                year: '2019',
                title: 'Market Leadership',
                description: 'Became trusted solar provider across East African region with thousands of installations',
                delay: '0.3s'
              },
              {
                year: '2016',
                title: 'Company Establishment',
                description: 'Founded with vision to transform East Africa through accessible solar energy',
                delay: '0.4s'
              }
            ].map((milestone, idx) => (
              <div
                key={idx}
                className="flex gap-6 items-start animate-reveal-up-soft"
                style={{ animationDelay: milestone.delay }}
              >
                <div className="flex-shrink-0 w-24 pt-1">
                  <div className="text-2xl font-bold text-primary">{milestone.year}</div>
                </div>
                <div className="flex-1 cinematic-panel p-6 border-white/10">
                  <h3 className="font-semibold text-lg mb-2 text-white/92">
                    {milestone.title}
                  </h3>
                  <p className="text-white/64">
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="py-24 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white/92 animate-reveal-up-soft">
            Join the Clean Energy Revolution
          </h2>
          <p className="text-xl text-white/64 mb-8 leading-relaxed animate-reveal-up-soft" style={{ animationDelay: '0.1s' }}>
            Whether you&apos;re a homeowner, business owner, or industrial facility, Feraj Solar is here to help you transition to clean, sustainable energy.
          </p>
          <a
            href="/products"
            className="inline-block px-8 py-4 border border-primary/50 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg font-semibold transition-colors animate-reveal-up-soft"
            style={{ animationDelay: '0.2s' }}
          >
            Explore Our Solutions
          </a>
        </div>
      </section>
    </div>
  );
}
