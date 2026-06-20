import { Link } from 'react-router';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Header } from './Header';
import { Footer } from './Footer';
import { PublicLayout } from './PublicLayout';
import { ACTUALITES } from '../data/actualites';

const CATEGORIE_COLORS: Record<string, string> = {
  'Annonce': 'bg-blue-100 text-blue-700',
  'Information': 'bg-green-100 text-green-700',
  'Événement': 'bg-purple-100 text-purple-700',
  'Réglementation': 'bg-orange-100 text-orange-700',
  'Infrastructures': 'bg-teal-100 text-teal-700',
  'Prestations': 'bg-pink-100 text-pink-700',
};

export function ActualitesPage() {
  const [featured, ...rest] = ACTUALITES;

  return (
    <PublicLayout>
      <Header />

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#0d1f38] to-[#1a3a6e] pt-32 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-[#4A90E2] mb-3">CNSS Bénin</p>
          <h1 className="text-5xl font-black text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>
            Actualités
          </h1>
          <div className="w-12 h-0.5 bg-[#4A90E2] mx-auto mb-6" />
          <p className="text-white/60 text-lg">
            Restez informé des dernières nouvelles, annonces et événements de la CNSS.
          </p>
        </div>
      </div>

      <div className="bg-gray-50 py-14 px-4">
        <div className="max-w-7xl mx-auto">

          {/* Article à la une */}
          <Link to={`/actualites/${featured.id}`} className="group block mb-10">
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="grid md:grid-cols-2">
                <div className="relative h-64 md:h-auto overflow-hidden">
                  <img src={featured.image} alt={featured.titre}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
                  <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold ${CATEGORIE_COLORS[featured.categorie] ?? 'bg-gray-100 text-gray-600'}`}>
                    À la une · {featured.categorie}
                  </span>
                </div>
                <div className="p-8 md:p-10 flex flex-col justify-center">
                  <h2 className="text-2xl font-black text-gray-900 mb-3 group-hover:text-[#4A90E2] transition-colors" style={{ fontFamily: 'Georgia, serif' }}>
                    {featured.titre}
                  </h2>
                  <p className="text-gray-500 text-sm leading-relaxed mb-6">{featured.extrait}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-400 mb-6">
                    <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{featured.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{featured.lecture} de lecture</span>
                  </div>
                  <span className="flex items-center gap-2 text-sm font-bold text-[#4A90E2] group-hover:gap-3 transition-all">
                    Lire l'article <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          </Link>

          {/* Grille des autres articles */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((actu) => (
              <Link key={actu.id} to={`/actualites/${actu.id}`}
                className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <img src={actu.image} alt={actu.titre}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <span className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-bold ${CATEGORIE_COLORS[actu.categorie] ?? 'bg-gray-100 text-gray-600'}`}>
                    {actu.categorie}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 mb-2 leading-snug group-hover:text-[#4A90E2] transition-colors line-clamp-2">
                    {actu.titre}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2 leading-relaxed">{actu.extrait}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{actu.date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{actu.lecture}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </PublicLayout>
  );
}
