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
    <section className="py-12 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-sky-50 text-sky-500 px-3 py-1.5 rounded-full mb-4">
            <Handshake className="w-5 h-5" />
            <span className="font-medium text-sm">Nos Partenaires</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-1">
            Ensemble pour une protection sociale forte
          </h2>
          <p className="text-sm text-gray-600 max-w-2xl mx-auto">
            La CNSS collabore avec des partenaires institutionnels et privés
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 items-center">
          {partenaires.map((partenaire) => (
            <div
              key={partenaire.id}
              className="flex flex-col items-center text-center p-3 bg-white rounded-lg border border-gray-100 hover:shadow-md transition-transform duration-150"
            >
              <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-3 overflow-hidden">
                <img
                  src={partenaire.logo}
                  alt={partenaire.nom}
                  className="w-16 h-16 object-contain"
                />
              </div>
              <div className="text-sm font-medium text-gray-900">{partenaire.nom}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <button className="px-4 py-2 bg-sky-500 text-white rounded-md text-sm font-medium hover:bg-sky-600 transition-colors">
            Nous contacter
          </button>
        </div>
      </div>
    </section>
  );
}
