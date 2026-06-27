import { useLocation, Link } from 'react-router';
import { Header } from './Header';
import { Footer } from './Footer';
import { PublicLayout } from './PublicLayout';
import { useState, useEffect } from 'react';
import { searchIntelligente } from '../api';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export function SearchResults() {
  const q = useQuery().get('query') || '';
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      if (q.trim()) {
        setLoading(true);
        try {
          const data = await searchIntelligente(q);
          setResults(data || []);
        } catch (error) {
          console.error('Erreur lors de la recherche:', error);
          setResults([]);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchResults();
  }, [q]);

  const faqs = results.filter((r) => r.type === 'faq');
  const actualites = results.filter((r) => r.type === 'actualite');

  return (
    <PublicLayout>
      <Header />
      <div className="max-w-6xl mx-auto py-16 px-4">
        <h1 className="text-2xl font-bold mb-6">Résultats de recherche pour « {q} »</h1>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block">
              <div className="flex gap-1 justify-center mb-4">
                <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
              <p className="text-gray-600 font-medium">Recherche en cours...</p>
            </div>
          </div>
        )}

        {!loading && results.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-600 font-medium mb-2">Aucun résultat trouvé</p>
            <p className="text-gray-500 text-sm">Essayez avec d'autres mots-clés ou consultez nos pages d'aide</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-lg font-semibold mb-3">FAQs</h2>
              {faqs.length === 0 ? (
                <p className="text-sm text-gray-500">Aucune FAQ trouvée.</p>
              ) : (
                <ul className="space-y-3">
                  {faqs.map((item, idx) => (
                    <li key={idx} className="p-4 border border-gray-100 rounded-md hover:shadow-sm">
                      <h3 className="font-semibold text-sky-600">{item.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{item.excerpt}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3">Actualités</h2>
              {actualites.length === 0 ? (
                <p className="text-sm text-gray-500">Aucune actualité trouvée.</p>
              ) : (
                <ul className="space-y-3">
                  {actualites.map((item, idx) => (
                    <li key={idx} className="p-4 border border-gray-100 rounded-md hover:shadow-sm">
                      <h3 className="font-semibold text-sky-600">{item.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{item.excerpt}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </PublicLayout>
  );
}

export default SearchResults;
