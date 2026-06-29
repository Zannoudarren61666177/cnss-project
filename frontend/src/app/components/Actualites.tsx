import { Link } from 'react-router';
import { Calendar, Clock, ArrowRight, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getActualites, getImageUrl } from '../api';

export function Actualites() {
  const [actualites, setActualites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await getActualites();
        setActualites((data as any[]).slice(0, 3));
      } catch (err) {
        console.error('Erreur chargement actualités', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50" id="actualites">
        <div className="flex items-center justify-center py-20">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-400" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50" id="actualites">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Actualités</h2>
            <p className="text-lg text-gray-600">Restez informé des dernières nouvelles de la CNSS</p>
          </div>
          <Link to="/actualites" className="hidden md:flex items-center gap-2 text-sky-500 hover:text-sky-600 hover:gap-3 font-medium transition-all">
            Voir toutes les actualités <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {actualites.length === 0 ? (
          <p className="text-center text-gray-500 py-10">Aucune actualité disponible.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {actualites.map((actu) => {
              const imageUrl = getImageUrl(actu.image);
              return (
                <Link
                  to={`/actualites/${actu.id}`}
                  key={actu.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group block"
                >
                  <div className="relative h-56 overflow-hidden">
                    {imageUrl ? (
                      <img src={imageUrl} alt={actu.titre}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                        <span className="text-blue-400 text-4xl font-bold">{actu.titre?.[0]}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-sky-500 text-sm font-semibold rounded-full">
                        {actu.categorie}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-sky-600 transition-colors line-clamp-2">
                      {actu.titre}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">{actu.extrait}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {actu.date_publication
                          ? new Date(actu.date_publication).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
                          : actu.date ?? '—'}
                      </span>
                      {actu.temps_lecture && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />{actu.temps_lecture}
                        </span>
                      )}
                    </div>
                    <button className="w-full py-3 bg-sky-50 text-sky-600 rounded-lg hover:bg-sky-600 hover:text-white font-semibold transition-all flex items-center justify-center gap-2 group-hover:gap-3">
                      Lire plus <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="md:hidden mt-6 text-center">
          <Link to="/actualites" className="text-blue-500 font-medium flex items-center gap-2 mx-auto transition-all">
            Voir toutes les actualités <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}