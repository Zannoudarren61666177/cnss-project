import { CheckCircle, Clock, CreditCard, Eye, Heart, XCircle } from 'lucide-react';
import { Badge, type BadgeVariant } from './shared/Badge';
import { StatCard } from './shared/StatCard';
import { SectionHeader } from './shared/SectionHeader';
import { SearchBar } from './shared/SearchBar';

// Données statiques (à remplacer par des appels API)
const demandesPrest: {
  id: string; nom: string; type: string; date: string;
  statut: 'En attente' | 'En cours' | 'Approuvée' | 'Rejetée';
}[] = [];

export function AgentPrestations() {
  const statusBadge = (s: typeof demandesPrest[0]['statut']) => {
    const map: Record<typeof demandesPrest[0]['statut'], BadgeVariant> = {
      'En attente': 'orange', 'En cours': 'blue', 'Approuvée': 'green', 'Rejetée': 'red',
    };
    return <Badge label={s} variant={map[s]} />;
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Prestations" sub="Instruction et paiement des prestations sociales" />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Demandes reçues" value={demandesPrest.length} sub="Ce mois" icon={<Heart className="w-5 h-5" />} color="bg-pink-100 text-pink-600" />
        <StatCard label="En attente" value={demandesPrest.filter(d => d.statut === 'En attente').length} icon={<Clock className="w-5 h-5" />} color="bg-orange-100 text-orange-600" />
        <StatCard label="Approuvées" value={demandesPrest.filter(d => d.statut === 'Approuvée').length} icon={<CheckCircle className="w-5 h-5" />} color="bg-green-100 text-green-600" />
        <StatCard label="Total versé" value="— FCFA" sub="Ce mois" icon={<CreditCard className="w-5 h-5" />} color="bg-blue-100 text-blue-600" />
      </div>

      <div>
        <SearchBar placeholder="Rechercher par bénéficiaire ou type de prestation..." />
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                {['Référence', 'Bénéficiaire', 'Type', 'Date', 'Statut', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {demandesPrest.map(d => (
                <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{d.id}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">{d.nom}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{d.type}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{d.date}</td>
                  <td className="px-4 py-3">{statusBadge(d.statut)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button className="p-1 text-gray-400 hover:text-blue-600"><Eye className="w-4 h-4" /></button>
                      {d.statut === 'En attente' && (
                        <>
                          <button className="p-1 text-gray-400 hover:text-green-600"><CheckCircle className="w-4 h-4" /></button>
                          <button className="p-1 text-gray-400 hover:text-red-600"><XCircle className="w-4 h-4" /></button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900">Paiements à effectuer</h3>
          <button className="flex items-center gap-1.5 px-3 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700">
            <CreditCard className="w-4 h-4" />Traiter tous
          </button>
        </div>
        <div className="space-y-3">
          {([] as { nom: string; type: string; montant: string; methode: string }[]).map((p, i) => (
            <div key={i} className="flex items-center gap-4 p-3 border border-gray-100 rounded-lg">
              <CreditCard className="w-5 h-5 text-green-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-gray-900">{p.nom}</p>
                <p className="text-xs text-gray-500">{p.type} · {p.methode}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm text-gray-900">{p.montant}</p>
                <button className="mt-1 px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-lg hover:bg-green-700">Payer</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}