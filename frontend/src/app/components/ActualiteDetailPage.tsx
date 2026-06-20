import { useParams, Link } from 'react-router';
import { ArrowLeft, Calendar, Clock, User } from 'lucide-react';
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

export function ActualiteDetailPage() {
  const { id } = useParams();
  const article = ACTUALITES.find(a => a.id === id);

  if (!article) {
    return (
      <PublicLayout>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Article introuvable.</p>
            <Link to="/actualites" className="text-[#4A90E2] font-semibold hover:underline">Retour aux actualités</Link>
          </div>
        </div>
        <Footer />
      </PublicLayout>
    );
  }

  const currentIndex = ACTUALITES.findIndex(a => a.id === id);
  const prev = currentIndex > 0 ? ACTUALITES[currentIndex - 1] : null;
  const next = currentIndex < ACTUALITES.length - 1 ? ACTUALITES[currentIndex + 1] : null;
  const autres = ACTUALITES.filter(a => a.id !== id).slice(0, 3);

  return (
    <PublicLayout>
      <Header />

      {/* Hero */}
      <div className="relative h-72 md:h-[420px] mt-20 overflow-hidden">
        <img src={article.image} alt={article.titre} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d1f38] via-[#0d1f38]/60 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-10 max-w-5xl mx-auto left-0 right-0">
          <Link to="/actualites" className="flex items-center gap-2 text-white/70 hover:text-white text-sm mb-4 transition-colors w-fit">
            <ArrowLeft className="w-4 h-4" /> Toutes les actualités
          </Link>
          <span className={`text-xs font-bold px-3 py-1 rounded-full w-fit mb-3 ${CATEGORIE_COLORS[article.categorie] ?? 'bg-gray-100 text-gray-600'}`}>
            {article.categorie}
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-white max-w-3xl" style={{ fontFamily: 'Georgia, serif' }}>
            {article.titre}
          </h1>
        </div>
      </div>

      <div className="bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-12">

            {/* Contenu */}
            <div className="lg:col-span-2">
              {/* Meta */}
              <div className="flex flex-wrap items-center gap-5 text-sm text-gray-400 mb-8 pb-6 border-b border-gray-100">
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{article.date}</span>
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{article.lecture} de lecture</span>
                <span className="flex items-center gap-1.5"><User className="w-4 h-4" />{article.auteur}</span>
              </div>

              {/* Texte */}
              <div className="space-y-4">
                {article.contenu.split('\n\n').map((para, i) => {
                  if (para.startsWith('- ') || para.includes('\n- ')) {
                    const lines = para.split('\n').filter(l => l.trim());
                    return (
                      <ul key={i} className="space-y-2 pl-1">
                        {lines.map((line, j) => (
                          <li key={j} className="flex items-start gap-2 text-gray-600 text-[15px]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#4A90E2] flex-shrink-0 mt-2" />
                            <span>{line.replace(/^-\s*/, '')}</span>
                          </li>
                        ))}
                      </ul>
                    );
                  }
                  if (para.endsWith(':')) {
                    return <p key={i} className="font-bold text-gray-800">{para}</p>;
                  }
                  return (
                    <p key={i} className="text-gray-600 leading-relaxed text-[15px]">{para}</p>
                  );
                })}
              </div>

              {/* Nav prev/next */}
              <div className="mt-12 pt-8 border-t border-gray-100 flex justify-between gap-4">
                {prev ? (
                  <Link to={`/actualites/${prev.id}`} className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#4A90E2] transition-colors">
                    <ArrowLeft className="w-4 h-4" /> {prev.titre.slice(0, 40)}…
                  </Link>
                ) : <div />}
                {next && (
                  <Link to={`/actualites/${next.id}`} className="flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-[#4A90E2] transition-colors text-right">
                    {next.titre.slice(0, 40)}… <ArrowLeft className="w-4 h-4 rotate-180" />
                  </Link>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Autres actualités</h3>
                <div className="space-y-4">
                  {autres.map(a => (
                    <Link key={a.id} to={`/actualites/${a.id}`} className="flex gap-3 group">
                      <img src={a.image} alt={a.titre} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800 group-hover:text-[#4A90E2] transition-colors line-clamp-2 leading-snug">{a.titre}</p>
                        <p className="text-xs text-gray-400 mt-1">{a.date}</p>
                      </div>
                    </Link>
                  ))}
                </div>
                <Link to="/actualites" className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-[#4A90E2] hover:gap-2.5 transition-all">
                  Voir toutes les actualités <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                </Link>
              </div>

              <div className="bg-[#0d1f38] rounded-2xl p-6 text-white">
                <h3 className="font-bold mb-2">Espace assuré</h3>
                <p className="text-white/60 text-sm mb-4">Accédez à votre espace personnel pour gérer vos droits et suivre vos cotisations.</p>
                <Link to="/connexion"
                  className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#4A90E2] rounded-xl text-sm font-semibold hover:bg-blue-600 transition-colors">
                  Se connecter
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </PublicLayout>
  );
}
