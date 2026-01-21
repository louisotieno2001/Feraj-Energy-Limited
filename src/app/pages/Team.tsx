import { directors } from '@/app/data/teamData';
import { Linkedin, Mail } from 'lucide-react';

export function Team() {
  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-r from-purple-600 to-indigo-500 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold mb-6">Leadership Team</h1>
          <p className="text-xl max-w-3xl text-purple-50">
            Meet the visionary leaders driving innovation and sustainability at Feraj Solar Limited
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Directors & Executive Team</h2>
            <p className="text-xl text-gray-600">
              Decades of combined experience in renewable energy, technology, and business leadership
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {directors.map(member => (
              <div key={member.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
                <div className="relative h-80 overflow-hidden bg-gray-200">
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="w-full h-full object-cover object-center"
                    style={{objectPosition: "center 20%"}}
                  />
                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{member.name}</h3>
                  <div className="text-green-600 font-semibold mb-4">{member.position}</div>
                  <p className="text-gray-600 mb-6 leading-relaxed">{member.bio}</p>
                  
                  <div className="flex gap-3">
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm"
                      >
                        <Linkedin className="h-4 w-4" />
                        LinkedIn
                      </a>
                    )}
                    <a
                      href={`mailto:${member.name.toLowerCase().replace(/ /g, '.')}@solartech.com`}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition text-sm"
                    >
                      <Mail className="h-4 w-4" />
                      Email
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Join Our Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
              We're always looking for talented individuals passionate about clean energy and sustainability
            </p>
            <button className="px-8 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition font-semibold">
              View Open Positions
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">2,500+</div>
              <div className="text-gray-600">Employees Worldwide</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">45+</div>
              <div className="text-gray-600">Nationalities Represented</div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">4.8/5</div>
              <div className="text-gray-600">Employee Satisfaction Rating</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
