import { useLocation, Link } from 'react-router';
import { PRESTATIONS } from '../data/prestations';
import { ACTUALITES } from '../data/actualites';
import { Header } from './Header';
import { Footer } from './Footer';
import { PublicLayout } from './PublicLayout';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export function SearchResults() {
  const q = useQuery().get('query') || '';
  const query = q.trim().toLowerCase();

  const prestationResults = PRESTATIONS.filter((p) => {
    return [p.titre, p.description, p.contenu, p.tag].join(' ').toLowerCase().includes(query);
  });

  const actualiteResults = ACTUALITES.filter((a) => {
    return [a.titre, a.extrait, a.description, a.contenu].join(' ').toLowerCase().includes(query);
  });

  return (
    <PublicLayout>
      <Header />
      <div className="max-w-6xl mx-auto py-16 px-4">
        <h1 className="text-2xl font-bold mb-6">Résultats de recherche pour « {q} »</h1>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-lg font-semibold mb-3">Prestations</h2>
            {prestationResults.length === 0 ? (
              <p className="text-sm text-gray-500">Aucune prestation trouvée.</p>
            ) : (
              <ul className="space-y-3">
                {prestationResults.map((p) => (
                  <li key={p.id} className="p-4 border border-gray-100 rounded-md hover:shadow-sm">
                    <Link to={`/prestations/${p.id}`} className="font-semibold text-sky-600">{p.titre}</Link>
                    <p className="text-sm text-gray-600 mt-1">{p.description}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-3">Actualités</h2>
            {actualiteResults.length === 0 ? (
              <p className="text-sm text-gray-500">Aucune actualité trouvée.</p>
            ) : (
              <ul className="space-y-3">
                {actualiteResults.map((a) => (
                  <li key={a.id} className="p-4 border border-gray-100 rounded-md hover:shadow-sm">
                    <Link to={`/actualites/${a.id}`} className="font-semibold text-sky-600">{a.titre}</Link>
                    <p className="text-sm text-gray-600 mt-1">{a.extrait}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </PublicLayout>
  );
}

export default SearchResults;
