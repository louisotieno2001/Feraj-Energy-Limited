import { useState } from 'react';
import { directors } from '@/app/data/teamData';
import { ChevronDown, Linkedin, Mail } from 'lucide-react';

export function Team() {
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({});

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-r from-primary to-accent text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-6">Leadership Team</h1>
          <p className="text-xl max-w-3xl text-white/90">
            Meet the visionary leaders driving innovation and sustainability at
            Feraj Solar Limited
          </p>
        </div>
      </section>

      <section className="py-20 bg-background/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Directors & Executive Team
            </h2>
            <p className="text-xl text-muted-foreground">
              Decades of combined experience in renewable energy, technology,
              and business leadership
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {directors.map((member) => (
              <div
                key={member.id}
                className="group bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl animate-fade"
              >
                <div className="relative h-80 overflow-hidden bg-secondary/70">
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                    style={{ objectPosition: 'center 20%' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
                </div>

                <div className="p-6">
                  <h3 className="text-2xl font-bold text-foreground mb-1">
                    {member.name}
                  </h3>
                  <div className="text-primary font-semibold mb-4">
                    {member.position}
                  </div>
                  <p className="text-muted-foreground mb-6 leading-relaxed line-clamp-3">
                    {member.bio}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      setOpenIds((prev) => ({
                        ...prev,
                        [member.id]: !prev[member.id],
                      }))
                    }
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition"
                    aria-expanded={!!openIds[member.id]}
                  >
                    {openIds[member.id] ? 'Hide bio' : 'View bio'}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        openIds[member.id] ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <div
                    className={`mt-4 overflow-hidden transition-all duration-300 ${
                      openIds[member.id]
                        ? 'max-h-64 opacity-100'
                        : 'max-h-0 opacity-0'
                    }`}
                  >
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {member.bio}
                    </p>
                    <div className="flex gap-3">
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition text-sm"
                        >
                          <Linkedin className="h-4 w-4" />
                          LinkedIn
                        </a>
                      )}
                      <a
                        href={`mailto:${member.name.toLowerCase().replace(/ /g, '.')}@ferajsolar.com`}
                        className="flex items-center gap-2 px-4 py-2 rounded-md btn-secondary text-sm"
                      >
                        <Mail className="h-4 w-4" />
                        Email
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-background/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Join Our Team</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              We&apos;re always looking for talented individuals passionate
              about clean energy and sustainability
            </p>
            <button className="px-8 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition font-semibold">
              View Open Positions
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-3xl font-bold text-primary mb-2">2,500+</div>
              <div className="text-muted-foreground">Employees Worldwide</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-3xl font-bold text-primary mb-2">45+</div>
              <div className="text-muted-foreground">
                Nationalities Represented
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-3xl font-bold text-primary mb-2">4.8/5</div>
              <div className="text-muted-foreground">
                Employee Satisfaction Rating
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
