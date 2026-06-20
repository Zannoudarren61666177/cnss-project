import { UserPlus, FileText, CreditCard, TrendingUp, Download, Bell } from 'lucide-react';

const services = [
  {
    icon: UserPlus,
    title: 'Immatriculation employeur',
    description: 'Inscrivez votre entreprise et obtenez votre numéro CNSS en ligne',
    color: 'bg-blue-500'
  },
  {
    icon: FileText,
    title: 'Déclaration des travailleurs',
    description: 'Déclarez vos employés et gérez leurs informations facilement',
    color: 'bg-purple-500'
  },
  {
    icon: CreditCard,
    title: 'Paiement des cotisations',
    description: 'Payez vos cotisations en ligne via Mobile Money ou carte bancaire',
    color: 'bg-blue-500'
  },
  {
    icon: TrendingUp,
    title: 'Suivi des droits',
    description: 'Consultez vos droits et prestations en temps réel',
    color: 'bg-orange-500'
  },
  {
    icon: Download,
    title: 'Documents & Attestations',
    description: 'Téléchargez vos documents officiels instantanément',
    color: 'bg-pink-500'
  },
  {
    icon: Bell,
    title: 'Notifications',
    description: 'Recevez des alertes pour vos échéances et mises à jour',
    color: 'bg-cyan-500'
  }
];

export function Services() {
  return (
    <section className="py-16 bg-gray-50" id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Nos services en ligne
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Accédez à tous nos services digitalisés pour gérer vos démarches de sécurité sociale
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-gray-100 group cursor-pointer"
              >
                <div className={`w-12 h-12 ${service.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm">{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
