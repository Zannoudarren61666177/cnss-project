import { useParams, Link } from 'react-router';
import { ArrowLeft, Calendar, Clock, User, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';
import { PublicLayout } from './PublicLayout';
import { getActualites, getImageUrl } from '../api';

const CATEGORIE_COLORS: Record<string, string> = {
  'Annonce': 'bg-blue-100 text-blue-700',
  'Information': 'bg-green-100 text-green-700',
  'Événement': 'bg-purple-100 text-purple-700',
  'Réglementation': 'bg-orange-100 text-orange-700',
  'Infrastructures': 'bg-teal-100 text-teal-700',
  'Prestations': 'bg-pink-100 text-pink-700',
};

function formatDate(d: string) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function ActualiteDetailPage() {
  const { id } = useParams();
  const [article, setArticle] = useState<any | null>(null);
  const [autres, setAutres] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const data = await getActualites();
        const all = data as any[];
        const found = all.find(a => String(a.id) === String(id));
        if (!found) { setNotFound(true); return; }
        setArticle(found);
        setAutres(all.filter(a => String(a.id) !== String(id)).slice(0, 3));
      } catch (err) {
        console.error('Erreur chargement article', err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <PublicLayout>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <RefreshCw className="w-8 h-8 animate-spin text-blue-400" />
        </div>
        <Footer />
      </PublicLayout>
    );
  }

  if (notFound || !article) {
    return (
      <PublicLayout>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-4">Article introuvable.</p>
            <Link to="/actualites" className="text-[#4A90E2] font-semibold hover:underline">
              Retour aux actualités
            </Link>
          </div>
        </div>
        <Footer />
      </PublicLayout>
    );
  }

  const articleImage = getImageUrl(article.image);

  return (
    <PublicLayout>
      <Header />

      {/* Hero */}
      <div className="relative h-72 md:h-[420px] mt-20 overflow-hidden">
        {articleImage ? (
          <img src={articleImage} alt={article.titre} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#0d1f38] to-[#1a3a6e]" />
        )}
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
              <div className="flex flex-wrap items-center gap-5 text-sm text-gray-400 mb-8 pb-6 border-b border-gray-100">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" />
                  {formatDate(article.date_publication ?? article.date)}
                </span>
                {article.temps_lecture && (
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4" />{article.temps_lecture} de lecture
                  </span>
                )}
                {article.auteur && (
                  <span className="flex items-center gap-1.5">
                    <User className="w-4 h-4" />{article.auteur}
                  </span>
                )}
              </div>

              {/* Texte */}
              <div className="space-y-4">
                {(article.description ?? article.contenu ?? '').split('\n\n').map((para: string, i: number) => {
                  if (para.startsWith('- ') || para.includes('\n- ')) {
                    const lines = para.split('\n').filter((l: string) => l.trim());
                    return (
                      <ul key={i} className="space-y-2 pl-1">
                        {lines.map((line: string, j: number) => (
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
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-4">Autres actualités</h3>
                <div className="space-y-4">
                  {autres.map(a => {
                    const autreImage = getImageUrl(a.image);
                    return (
                      <Link key={a.id} to={`/actualites/${a.id}`} className="flex gap-3 group">
                        {autreImage ? (
                          <img src={autreImage} alt={a.titre}
                            className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-blue-100 flex-shrink-0" />
                        )}
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-800 group-hover:text-[#4A90E2] transition-colors line-clamp-2 leading-snug">
                            {a.titre}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {formatDate(a.date_publication ?? a.date)}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
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