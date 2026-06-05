import { Calendar, Clock, ArrowRight } from 'lucide-react';

const actualites = [
  {
    id: 1,
    categorie: 'Annonce',
    titre: 'Nouvelle plateforme digitale CNSS',
    description: 'Découvrez notre nouvelle plateforme en ligne pour faciliter vos démarches administratives et le suivi de vos droits.',
    extrait: 'La CNSS lance sa plateforme digitale moderne permettant aux employeurs et travailleurs de gérer leurs cotisations en ligne...',
    date: '25 Avril 2026',
    lecture: '3 min',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop'
  },
  {
    id: 2,
    categorie: 'Information',
    titre: 'Paiement des cotisations par Mobile Money',
    description: 'Il est désormais possible de régler vos cotisations directement via Mobile Money. Plus simple, plus rapide.',
    extrait: 'Payez vos cotisations CNSS avec MTN Mobile Money, Moov Money et Celtiis Cash. Un service disponible 24h/24...',
    date: '20 Avril 2026',
    lecture: '2 min',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop'
  },
  {
    id: 3,
    categorie: 'Événement',
    titre: 'Journée portes ouvertes dans nos agences',
    description: 'Venez nous rencontrer lors de nos journées portes ouvertes pour obtenir des conseils personnalisés.',
    extrait: 'Du 1er au 5 mai 2026, toutes nos agences vous accueillent pour répondre à vos questions sur vos droits sociaux...',
    date: '15 Avril 2026',
    lecture: '1 min',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&h=400&fit=crop'
  }
];

export function Actualites() {
  return (
    <section className="py-16 bg-gray-50" id="actualites">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Actualités
            </h2>
            <p className="text-lg text-gray-600">
              Restez informé des dernières nouvelles de la CNSS
            </p>
          </div>
          <button className="hidden md:flex items-center gap-2 text-blue-500 hover:text-blue-600 hover:gap-3 font-medium transition-all">
            Voir toutes les actualités
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {actualites.map((actu) => (
            <article
              key={actu.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={actu.image}
                  alt={actu.titre}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-blue-600 text-sm font-semibold rounded-full">
                    {actu.categorie}
                  </span>
                </div>
              </div>

              {/* Contenu */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {actu.titre}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {actu.extrait}
                </p>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {actu.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {actu.lecture}
                    </div>
                  </div>
                </div>

                <button className="w-full py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white font-semibold transition-all flex items-center justify-center gap-2 group-hover:gap-3">
                  Lire plus
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="md:hidden mt-6 text-center">
          <button className="text-blue-500 hover:text-blue-600 hover:gap-3 font-medium flex items-center gap-2 mx-auto transition-all">
            Voir toutes les actualités
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
