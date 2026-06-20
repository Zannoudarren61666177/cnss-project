import { Link } from 'react-router';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { Header } from './Header';
import { Footer } from './Footer';
import { PublicLayout } from './PublicLayout';
import { PRESTATIONS } from '../data/prestations';

export function PrestationsPage() {
  return (
    <PublicLayout>
      <Header />

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#0d1f38] to-[#1a3a6e] pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-[#4A90E2] mb-3">CNSS Bénin</p>
          <h1 className="text-5xl font-black text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            Nos Prestations
          </h1>
          <div className="w-12 h-0.5 bg-[#4A90E2] mx-auto mb-6" />
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Depuis 1956, la CNSS protège les travailleurs béninois et leurs familles à travers quatre branches de prestations sociales.
          </p>
        </div>
      </div>

      {/* Cartes */}
      <div className="bg-gray-50 py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {PRESTATIONS.map((p) => (
              <Link
                key={p.id}
                to={`/prestations/${p.id}`}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={p.photo} alt={p.titre} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute top-3 left-3 text-xs font-bold text-white/50 tracking-widest">{p.numero}</span>
                  <span className="absolute bottom-3 left-3 right-3 text-xs font-semibold text-white bg-[#4A90E2]/80 backdrop-blur-sm rounded-full px-3 py-1 text-center">{p.tag}</span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 mb-2">{p.titre}</h3>
                  <p className="text-sm text-gray-500 mb-4 leading-relaxed">{p.description}</p>
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-[#4A90E2] group-hover:gap-2.5 transition-all">
                    Voir les détails <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* Section commune */}
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
              Qui peut bénéficier des prestations CNSS ?
            </h2>
            <div className="w-10 h-0.5 bg-[#4A90E2] mb-6" />
            <div className="grid md:grid-cols-2 gap-8 text-sm text-gray-600 leading-relaxed">
              <div>
                <p className="mb-4">
                  Toute personne exerçant une activité salariée soumise aux dispositions du Code du Travail béninois est obligatoirement affiliée à la CNSS. L'affiliation est automatique dès l'embauche et ne requiert aucune démarche particulière de la part du travailleur.
                </p>
                <p>
                  Les droits ouverts dépendent de la durée et de la régularité des cotisations versées par l'employeur. Un suivi de carrière est disponible en ligne sur l'espace travailleur.
                </p>
              </div>
              <div className="space-y-3">
                {[
                  'Salariés du secteur privé (Code du Travail)',
                  'Agents contractuels de l\'État',
                  'Travailleurs domestiques (gens de maison)',
                  'Travailleurs en assurance volontaire',
                  'Apprentis et stagiaires rémunérés',
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <CheckCircle className="w-4 h-4 text-[#4A90E2] flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </PublicLayout>
  );
}
