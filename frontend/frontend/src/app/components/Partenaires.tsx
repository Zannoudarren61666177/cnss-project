import { Handshake } from 'lucide-react';

const partenaires = [
  {
    id: 1,
    nom: 'ANIP',
    description: 'Agence Nationale pour l\'Identification des Personnes',
    logo: 'https://via.placeholder.com/200x100/4F46E5/FFFFFF?text=ANIP',
  },
  {
    id: 2,
    nom: 'Ministère du Travail',
    description: 'Ministère du Travail et de la Fonction Publique',
    logo: 'https://via.placeholder.com/200x100/059669/FFFFFF?text=MTFP',
  },
  {
    id: 3,
    nom: 'DGI',
    description: 'Direction Générale des Impôts',
    logo: 'https://via.placeholder.com/200x100/DC2626/FFFFFF?text=DGI',
  },
  {
    id: 4,
    nom: 'APIEX',
    description: 'Agence de Promotion des Investissements et des Exportations',
    logo: 'https://via.placeholder.com/200x100/7C3AED/FFFFFF?text=APIEX',
  },
  {
    id: 5,
    nom: 'ARCH',
    description: 'Agence de Réglementation et de Contrôle de l\'Habitat',
    logo: 'https://via.placeholder.com/200x100/EA580C/FFFFFF?text=ARCH',
  },
  {
    id: 6,
    nom: 'Cnama',
    description: 'Chambre d\'Agriculture du Mono et du Couffo',
    logo: 'https://via.placeholder.com/200x100/0891B2/FFFFFF?text=CAMA',
  },
  {
    id: 7,
    nom: 'CCIB',
    description: 'Chambre de Commerce et d\'Industrie du Bénin',
    logo: 'https://via.placeholder.com/200x100/16A34A/FFFFFF?text=CCIB',
  },
  {
    id: 8,
    nom: 'OIT',
    description: 'Organisation Internationale du Travail',
    logo: 'https://via.placeholder.com/200x100/2563EB/FFFFFF?text=OIT',
  },
];

export function Partenaires() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 bg-blue-100 text-blue-600 px-6 py-3 rounded-full mb-6">
            <Handshake className="w-6 h-6" />
            <span className="font-semibold">Nos Partenaires</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Ensemble pour une protection sociale forte
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            La CNSS collabore avec de nombreux partenaires institutionnels et privés pour garantir un service de qualité
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {partenaires.map((partenaire) => (
            <div
              key={partenaire.id}
              className="bg-white rounded-2xl shadow-md border border-gray-200 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300 group"
            >
              <div className="flex flex-col items-center text-center h-full">
                <div className="w-full h-24 flex items-center justify-center mb-4 bg-gray-50 rounded-xl group-hover:bg-gray-100 transition-colors">
                  <img
                    src={partenaire.logo}
                    alt={partenaire.nom}
                    className="max-w-full max-h-20 object-contain"
                  />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{partenaire.nom}</h3>
                <p className="text-xs text-gray-600">{partenaire.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Vous souhaitez devenir partenaire ?</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Rejoignez notre réseau de partenaires et contribuez au développement de la protection sociale au Bénin
          </p>
          <button className="px-8 py-3 bg-white text-blue-600 hover:bg-blue-50 rounded-lg font-semibold transition-all hover:scale-105 shadow-lg">
            Nous contacter
          </button>
        </div>
      </div>
    </section>
  );
}
