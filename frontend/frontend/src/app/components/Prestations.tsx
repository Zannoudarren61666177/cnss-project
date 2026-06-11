import { Heart, Baby, Briefcase, Home, ArrowRight } from 'lucide-react';

const prestations = [
  {
    icon: Heart,
    title: 'Prestations de santé',
    description: 'Couverture médicale et soins de santé pour vous et votre famille',
    benefits: ['Consultations médicales', 'Hospitalisation', 'Médicaments'],
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=300&fit=crop',
    color: 'from-red-500 to-pink-500'
  },
  {
    icon: Baby,
    title: 'Prestations familiales',
    description: 'Allocations pour soutenir votre famille',
    benefits: ['Allocations familiales', 'Congé maternité', 'Prime de naissance'],
    image: 'https://images.unsplash.com/photo-1476703993599-0035a21b17a9?w=400&h=300&fit=crop',
    color: 'from-purple-500 to-indigo-500'
  },
  {
    icon: Briefcase,
    title: 'Retraite',
    description: 'Pension de retraite après votre carrière professionnelle',
    benefits: ['Pension de vieillesse', 'Retraite anticipée', 'Réversion'],
    image: 'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=400&h=300&fit=crop',
    color: 'from-blue-500 to-cyan-500'
  },
  {
    icon: Home,
    title: 'Accidents de travail',
    description: 'Protection en cas d\'accident professionnel',
    benefits: ['Indemnités journalières', 'Soins médicaux', 'Rééducation'],
    image: 'https://images.unsplash.com/photo-1504439468489-c8920d796a29?w=400&h=300&fit=crop',
    color: 'from-orange-500 to-red-500'
  }
];

export function Prestations() {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white" id="prestations">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-blue-100 rounded-full mb-4">
            <span className="text-blue-600 font-semibold text-sm">Nos Services</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Nos prestations
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            La CNSS vous protège et vous accompagne dans tous les moments importants de votre vie
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {prestations.map((prestation, index) => {
            const Icon = prestation.icon;
            return (
              <div
                key={index}
                className="group cursor-pointer"
              >
                <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300">
                  {/* Image de fond */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={prestation.image}
                      alt={prestation.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${prestation.color} opacity-80`}></div>

                    {/* Icône */}
                    <div className="absolute top-4 right-4 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/40">
                      <Icon className="w-6 h-6 text-white" />
                    </div>

                    {/* Titre sur l'image */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                      <h3 className="text-xl font-bold text-white">{prestation.title}</h3>
                    </div>
                  </div>

                  {/* Contenu */}
                  <div className="bg-white p-6">
                    <p className="text-sm text-gray-600 mb-4">{prestation.description}</p>
                    <ul className="space-y-2 mb-6">
                      {prestation.benefits.map((benefit, i) => (
                        <li key={i} className="text-sm text-gray-700 flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                    <button className="text-blue-600 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all group-hover:text-blue-700">
                      En savoir plus
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
